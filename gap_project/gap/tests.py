from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from django.urls import reverse
from unittest.mock import patch
from django.contrib.auth.models import User
from gap.models import GapAnalysis, Company, UserProfile, Section, Question, Input
from gap.serializers import CompanyListSerializer, CompanySerializer, GapAnalysisSerializer, QuestionsSerializer, AnswersSerializer
from django.core.exceptions import ValidationError
from gap.views import generate_pdf_plan
import random
from django.utils import timezone

# Create your tests here.
class ViewsAndUrlsTesting(TestCase):

    def setUp(self): #setup
        self.client = APIClient()
        self.user = User.objects.create_user(username = 'testAccount', password = 'tEsT1234')
        self.company = Company.objects.create(name ='Test500')

        self.gap = GapAnalysis.objects.create(
            company = self.company,
            consultant = 'ConsultantTest',
            company_rep ='RepcompanyTest',
            company_email='test@test.com',
            additional_notes='Some notes',
            url = 'test.come',
            title = 'TestingGap')
        self.gap.gap_data = {
                1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                11: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                12: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],}
        sample_plan = [
            "Hello, this should be question one of a set",
            "Me again, this is question 2",
            "sOrry for inconsistincy in numbering- 3 three",
            "that last one was just question 3, not thirty three. This is qFour",
            "Five. I am bored",
            "6666666666",
            "SEvvvennnnn",
            "eigh",
            "t. Nine",
            "fjkdlsjfdklfjk10101010101001",
        ]
        self.gap.improvement_plan = {
            1: sample_plan,
            2: sample_plan,
            3: sample_plan,
            4: sample_plan,
            5: sample_plan,
            6: sample_plan,
            7: sample_plan,
            8: sample_plan,
            9: sample_plan,
            10: sample_plan,
            11: sample_plan,
            12: sample_plan,
        }

        self.gap.improvement_plan = {i: sample_plan for i in range(1, 13)}
        self.gap.save()

    def testLogin(self): #loginView
        url = '/api/login/'
        data = {'username': 'testAccount', 'password': 'tEsT1234'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)


    def testCompanyList(self):
        url = '/api/companies/'
        response = self.client.get(url, format ='json')
        self.assertEqual(response.status_code, 200)
        companies = response.data
        self.assertTrue(any(company['name'] == 'Test500' for company in companies))

    def testGetLatestGap(self):
        url = '/api/get-latest-gap/?company_name=Test500'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('gap_id'), self.gap.id)

    @patch ("gap.views.open", side_effect=FileNotFoundError)
    def testPDFViewGet(self, mock_open):
        url = '/gap/pdfplan/'
        response = self.client.get(url, format='json', HTTP_ACCEPT='application/json')
        self.assertEqual(response.status_code, 404)
    @patch ("gap.views.generate_pdf_plan", return_value=None)
    def testPDFViewPost(self, mock_generatePdfPlan):
        url = '/gap/pdfplan/'
        data = {"id": self.gap.id}
        response = self.client.post(url,data, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('pdf'), 'TestingGap.pdf')

    def testGetIncompleteAnswers(self):
        url = f'/api/get_incomplete_answers/?gap_id={self.gap.id}'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)

    @patch("gap.views.get_question", return_value=None)
    def testGetQuestionOrWriteAnswerGET(self, mock_getQuestion):
        url = '/api/getQuestionOrWriteAnswer/'
        data = {
            "GetOrWrite": "GET",
            "Set":1,
            "Number":1
        }
        response = self.client.post( url, data, format = 'json')
        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.data)

    def testGetQuestionOrWriteAnswerPOST(self):
        url = '/api/getQuestionOrWriteAnswer/'
        data = {
            "GetOrWrite": "POST",
            "finished": True,
            "company_name": "Test500",
            "id": self.gap.id,
            "answers": {"1": [1, 2, 3]},
            "improvementPlan": {"1": ["answer"]}
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)

    
    def testScores(self):
        url = f'/api/scores/{self.gap.id}/Policy/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code,200)
        scores = response.json().get('scores', {})

        self.assertEqual(scores.get('exceptionalCompliance'), 0)
        self.assertEqual(scores.get('goodCompliance'), 0)
        self.assertEqual(scores.get('basicCompliance'), 0)
        self.assertEqual(scores.get('needsImprovement'), 0)
        self.assertEqual(scores.get('unsatisfactory'), 0)

    def testOverallScores(self):
        url = f'/api/overall-scores/{self.gap.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        totals= response.data.get("totals", {})
        self.assertEqual(totals.get('exceptional'), 0)
        self.assertEqual(totals.get('good'), 0)
        self.assertEqual(totals.get('basic'), 0)
        self.assertEqual(totals.get('needsImprovement'), 0)
        self.assertEqual(totals.get('unsatisfactory'), 0)
        self.assertEqual(response.data.get("total_score"), 0)
    
    def testGetPastAnalyses(self):
        url = '/api/past_analyses/Test500/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("company_name"), "Test500")
        self.assertIn("past_analyses", response.data)
        self.assertIn("recent_title", response.data)

    def testCompanyDetail(self):
        url = f'/api/companies/{self.company.pk}/'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'), 'Test500')

    def testCompanyLatestTotal(self):
        url = '/api/company-latest-total-score/Test500/'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.data.get('score'), 0)

    def testBarChart(self):
        url = f'/api/analysis/{self.gap.id}/bar-chart-data/'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        data = response.json() 
        self.assertIn("categories", data)
        self.assertIn("values",  data)
        self.assertTrue(all(v == 0 for v in 
        data.get("values", [])))

    def testPieChart(self):
        url = f'/api/element-scores/{self.gap.id}/Policy/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)

        for item in response.data:
            self.assertIn("name", item)
            self.assertIn("value", item)
            self.assertEqual(item["value"], 0)

    def testScoreOverTime(self):
        url = f'/api/analysis/Test500/total-score-over-time/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("gap_date", data)
        self.assertIn("total_score", data)
        self.assertEqual(data.get("total_score"), [0])

    def testCompanyDeleteView(self):
        url = '/api/companies/Test500/delete/'
        response = self.client.delete(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        with self.assertRaises(Company.DoesNotExist):
            Company.objects.get(name='TestDelete')

    def testDeleteCompany(self):
        new_company = Company.objects.create(name = 'testDelete')
        url = '/api/companies/testDelete/delete/'
        response = self.client.delete(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        with self.assertRaises(Company.DoesNotExist):
            Company.objects.get(name='testDelete')
      
""" MODEL TESTS"""
class GapAnalysisModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
        gap_analysis = GapAnalysis.objects.create(
            company=self.company, 
            consultant="Test Consultant", 
            gap_data={"test": "data"}, 
            improvement_plan={"test": "plan"}, 
            company_rep="Test Rep", 
            company_email="Test@Rep.com",
            additional_notes="Test Notes",
            url="www.test.com"
            )
        self.assertEqual(str(gap_analysis), gap_analysis.date.strftime("%d/%m/%Y"))
    
    def test_gap_analysis_defaults(self):
        gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            consultant="Test Consultant",
            company_rep="Test Rep"
        )
        """checks the default values of the GapAnalysis model."""
        self.assertEqual(gap_analysis.gap_data, {})
        self.assertEqual(gap_analysis.improvement_plan, {})
        self.assertEqual(gap_analysis.company_email, "example@company.com")
        self.assertEqual(gap_analysis.url, "no url given")

    def test_title_max_length(self):
        """this tests that title ('gap analysis' {date}) cannot exceed max length."""
        gap_analysis = GapAnalysis.objects.create(
            company=self.company,
            title="A" * 51,  # this exceeds the max length of 50
            consultant="John Doe",
            company_rep="Jane Smith"
        )
        with self.assertRaises(ValidationError):
            gap_analysis.full_clean()  # check that the title is not too long
    
    def test_consultant_required(self):
        """Test that consultant field cannot be blank."""
        gap_analysis = GapAnalysis(
            company=self.company,
            company_rep="Jane Smith"
        )
        with self.assertRaises(ValidationError):
            gap_analysis.full_clean()



class CompanyModelTest(TestCase):
    def test_create_company(self):
        """Test creating a Company instance."""
        company = Company.objects.create(
            name="Test Company",
            num_of_analysis=5,
            notes="This is a test company.",
            current_gap=True
        )
        self.assertEqual(str(company), "Test Company")
        self.assertEqual(company.num_of_analysis, 5)
        self.assertTrue(company.current_gap)

    def test_company_defaults(self):
        """Test default values of Company fields."""
        company = Company.objects.create(name="Default Test Company")
        self.assertEqual(company.num_of_analysis, 0)
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
            date=timezone.now(),
            consultant="John Doe",
            company_rep="Jane Smith"
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
            num_of_analysis=5,
            notes="This is a test company."
        )

    def test_company_list_serializer(self):
        """Test CompanyListSerializer serialization."""
        serializer = CompanyListSerializer(instance=self.company)
        expected_data = {
            'name': "Test Company",
            'num_of_analysis': 5,
            'date_registered': self.company.date_registered.isoformat(),
            'notes': "This is a test company."
        }
        self.assertEqual(serializer.data, expected_data)

    def test_company_serializer(self):
        """Test CompanySerializer serialization."""
        serializer = CompanySerializer(instance=self.company)
        expected_data = {
            'name': "Test Company",
            'date_registered': self.company.date_registered.isoformat(),
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
            'company_rep': "Jane Smith",
            'company_email': "jane@company.com",
            'additional_notes': "Some notes",
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
        self.gap_analysis_data['company_email'] = "invalid-email"
        serializer = GapAnalysisSerializer(data=self.gap_analysis_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('company_email', serializer.errors)


class QuestionsSerializerTest(TestCase):
    def test_questions_serializer(self):
        """Test QuestionsSerializer with valid input."""
        data = {'get_or_write': 'GET'}
        serializer = QuestionsSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['get_or_write'], 'GET')

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
            company_rep="Jane Smith",
            company_email="jane@company.com",
            gap_data={"question1": "answer1"},
            improvement_plan={"task1": "improve process"},
            date=timezone.now()
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

