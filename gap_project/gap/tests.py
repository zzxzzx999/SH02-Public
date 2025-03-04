from django.test import TestCase
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from gap.models import Company, GapAnalysis, UserProfile, Section, Question, Input
from gap.serializers import CompanyListSerializer, CompanySerializer, GapAnalysisSerializer, QuestionsSerializer, AnswersSerializer

""" MODEL TESTS"""
class GapAnalysisModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
        gap_analysis = GapAnalysis.objects.create(
            company=self.company, 
            consultant="Test Consultant", 
            gap_data={"test": "data"}, 
            improvement_plan={"test": "plan"}, 
            companyRep="Test Rep", 
            companyEmail="Test@Rep.com",
            additionalNotes="Test Notes",
            url="www.test.com"
            )
        self.assertEqual(str(gap_analysis), gap_analysis.date.strftime("%d/%m/%Y"))
    
    def test_gap_analysis_defaults(self):
        gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            consultant="Test Consultant",
            companyRep="Test Rep"
        )
        """checks the default values of the GapAnalysis model."""
        self.assertEqual(gap_analysis.gap_data, {})
        self.assertEqual(gap_analysis.improvement_plan, {})
        self.assertEqual(gap_analysis.companyEmail, "example@company.com")
        self.assertEqual(gap_analysis.url, "no url given")

    def test_title_max_length(self):
        """this tests that title ('gap analysis' {date}) cannot exceed max length."""
        gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            title="A" * 51,  # this exceeds the max length of 50
            consultant="John Doe",
            companyRep="Jane Smith"
        )
        with self.assertRaises(ValidationError):
            gap_analysis.full_clean()  # check that the title is not too long
    
    def test_consultant_required(self):
        """Test that consultant field cannot be blank."""
        gap_analysis = GapAnalysis(
            company=self.company,
            companyRep="Jane Smith"
        )
        with self.assertRaises(ValidationError):
            gap_analysis.full_clean()



class CompanyModelTest(TestCase):
    def test_create_company(self):
        """Test creating a Company instance."""
        company = Company.objects.create(
            name="Test Company",
            numOfAnalysis=5,
            notes="This is a test company.",
            current_gap=True
        )
        self.assertEqual(str(company), "Test Company")
        self.assertEqual(company.numOfAnalysis, 5)
        self.assertTrue(company.current_gap)

    def test_company_defaults(self):
        """Test default values of Company fields."""
        company = Company.objects.create(name="Default Test Company")
        self.assertEqual(company.numOfAnalysis, 0)
        self.assertFalse(company.current_gap)


class UserProfileModelTest(TestCase):
    def test_create_user_profile(self):
        """Test creating a UserProfile instance."""
        user = User.objects.create(username="testuser")
        profile = UserProfile.objects.create(user=user, is_admin=True)
        
        self.assertEqual(str(profile), "testuser")
        self.assertTrue(profile.is_admin)

    def test_user_profile_defaults(self):
        """Test default values of UserProfile fields."""
        user = User.objects.create(username="testuser2")
        profile = UserProfile.objects.create(user=user)
        
        self.assertFalse(profile.is_admin)


class SectionModelTest(TestCase):
    def test_create_section(self):
        """Test creating a Section instance."""
        section = Section.objects.create(name="General")
        
        self.assertEqual(str(section), "General")


class QuestionModelTest(TestCase):
    def setUp(self):
        """Set up data for tests."""
        self.section = Section.objects.create(name="General")

    def test_create_question(self):
        """Test creating a Question instance."""
        question = Question.objects.create(
            section=self.section,
            question_number="Q1",
            question_text="What is your biggest challenge?"
        )
        
        self.assertEqual(str(question), "General - Q1")


class InputModelTest(TestCase):
    def setUp(self):
        """Set up related data for Input model."""
        self.company = Company.objects.create(name="Test Company")
        self.gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            date=timezone.now().date(),
            consultant="John Doe",
            companyRep="Jane Smith"
        )
        self.section = Section.objects.create(name="General")
        self.question = Question.objects.create(
            section=self.section,
            question_number="Q1",
            question_text="What is your biggest challenge?"
        )

    def test_create_input(self):
        """Test creating an Input instance."""
        input_instance = Input.objects.create(
            gap_analysis=self.gap_analysis,
            question=self.question,
            rating=3,
            evidence="Some evidence provided",
            improvement="Suggest more training"
        )

        self.assertEqual(str(input_instance), f"{self.gap_analysis} :General :Q1")
        self.assertEqual(input_instance.rating, 3)
        self.assertEqual(input_instance.evidence, "Some evidence provided")
        self.assertEqual(input_instance.improvement, "Suggest more training")

    def test_input_defaults(self):
        """Test default values of Input fields."""
        input_instance = Input.objects.create(
            gap_analysis=self.gap_analysis,
            question=self.question
        )

        self.assertEqual(input_instance.rating, 0)
        self.assertIsNone(input_instance.evidence)
        self.assertIsNone(input_instance.improvement)

"""SERIALIZER TESTS"""


class CompanySerializerTest(TestCase):
    def setUp(self):
        """Create a sample company instance for testing."""
        self.company = Company.objects.create(
            name="Test Company",
            numOfAnalysis=5,
            notes="This is a test company."
        )

    def test_company_list_serializer(self):
        """Test CompanyListSerializer serialization."""
        serializer = CompanyListSerializer(instance=self.company)
        expected_data = {
            'name': "Test Company",
            'numOfAnalysis': 5,
            'dateRegistered': self.company.dateRegistered.isoformat(),
            'notes': "This is a test company."
        }
        self.assertEqual(serializer.data, expected_data)

    def test_company_serializer(self):
        """Test CompanySerializer serialization."""
        serializer = CompanySerializer(instance=self.company)
        expected_data = {
            'name': "Test Company",
            'dateRegistered': self.company.dateRegistered.isoformat(),
            'notes': "This is a test company.",
            'current_gap': False  # Default value
        }
        self.assertEqual(serializer.data, expected_data)


class GapAnalysisSerializerTest(TestCase):
    def setUp(self):
        """Create a sample GapAnalysis instance for testing."""
        self.company = Company.objects.create(name="Test Company")
        self.gap_analysis_data = {
            'title': "Gap Analysis Test",
            'company': self.company.id,
            'consultant': "John Doe",
            'companyRep': "Jane Smith",
            'companyEmail': "jane@company.com",
            'additionalNotes': "Some notes",
            'url': "http://example.com",
            'gap_data': {"question1": "answer1"},
            'improvement_plan': {"task1": "improve process"}
        }

    def test_gap_analysis_serializer_valid_data(self):
        """Test valid GapAnalysisSerializer serialization and deserialization."""
        serializer = GapAnalysisSerializer(data=self.gap_analysis_data)
        self.assertTrue(serializer.is_valid())
        gap_analysis = serializer.save()
        self.assertEqual(gap_analysis.title, "Gap Analysis Test")
        self.assertEqual(gap_analysis.gap_data, {"question1": "answer1"})
        self.assertEqual(gap_analysis.improvement_plan, {"task1": "improve process"})

    def test_gap_analysis_serializer_invalid_email(self):
        """Test GapAnalysisSerializer validation for an invalid email."""
        self.gap_analysis_data['companyEmail'] = "invalid-email"
        serializer = GapAnalysisSerializer(data=self.gap_analysis_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('companyEmail', serializer.errors)


class QuestionsSerializerTest(TestCase):
    def test_questions_serializer(self):
        """Test QuestionsSerializer with valid input."""
        data = {'GetOrWrite': 'GET'}
        serializer = QuestionsSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['GetOrWrite'], 'GET')

    def test_questions_serializer_missing_field(self):
        """Test QuestionsSerializer with missing optional field."""
        data = {}
        serializer = QuestionsSerializer(data=data)
        self.assertTrue(serializer.is_valid())  # Because it's an optional field


class AnswersSerializerTest(TestCase):
    def setUp(self):
        """Create a sample GapAnalysis instance for testing."""
        self.company = Company.objects.create(name="Test Company")
        self.gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            consultant="John Doe",
            companyRep="Jane Smith",
            companyEmail="jane@company.com",
            gap_data={"question1": "answer1"},
            improvement_plan={"task1": "improve process"},
            date=timezone.now().date()
        )

    def test_answers_serializer(self):
        """Test AnswersSerializer serialization."""
        serializer = AnswersSerializer(instance=self.gap_analysis)
        expected_data = {
            'id': self.gap_analysis.id,
            'gap_data': {"question1": "answer1"},
            'improvement_plan': {"task1": "improve process"}
        }
        self.assertEqual(serializer.data, expected_data)

