from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from gap.models import GapAnalysis, Company
import random

# Create your tests here.
class ViewsAndUrlsTesting(TestCase):

    def testAccount(self): #setup
        self.client = APIClient()
        self.user = User.objects.create_user(username = 'testAccount', password = 'tEsT1234')
        self.company = Company.objects.create(name ='Test500')

        self.gap = GapAnalysis.objects.create(
            company = self.company,
            consultant = 'ConsultantTest',
            companyRep ='RepcompanyTest',
            companyEmail='test@test.com',
            additionalNotes='Some notes',
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

        
        self.gap.save()

    def testLogin(self): #loginView
        url = '/api/login/'
        data = {'username': 'testAccount', 'password': 'Test500'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        selfassertIn('token', response.data)


    def testCompanyList(self):
        url = '/api/companies/'
        response = self.client.get(url, format ='json')
        self.assertEqual(response.status_code, 200)
        companies = response.data
        self.assertTrue(any(company['name'] == 'Test500' for company in companies))

    def testGetLatestGap(self):
        url = '/api/get-latest-game'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('gap_id'), self.gap.id)

    def testPDFViewGet(self):
        url = '/pdfplan/'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.data)
    def testPDFViewPost(self):
        url = '/pdfplan/'
        data = {"id": self.gap.id}
        response = self.client.post(url,data, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('pdf'), 'TestingGap.pdf')

    def testGetIncompleteAnswers(self):
        url = f'/api/get_incomplete_answers/?gap_id={self.gap.id}'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)

    def testGetQuestionOrWriteAnswer(self):
        url = '/api/getQuestionOrWriteAnswer/'
        data = {
            "GetOrWrite": "GET",
            "Set":1,
            "Number":1
        }
        response = self.client.post( url, data, format = 'json')
        self.assertEqual(response.status_code, 404)
        self.assertIn("error", response.data)

    def testGetQuestionOrWriteAnswer(self):
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
        scores = response.data.get('scores', {})

        self.assertEqual(scores.get('exceptionalCompliance'), 0)
        self.assertEqual(scores.get('goodCompliance'), 0)
        self.assertEqual(scores.get('basicCompliance'), 0)
        self.assertEqual(scores.get('needsImprovement'), 0)
        self.assertEqual(scores.get('unsatisfactory'), 0)

    def testOverallScores(self):
        url = f'/api/overall-scores/{self.gap.id}'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, 200)
        totals= response.data.get("totals", {})
        self.assertEqual(totals.get('exceptionalCompliance'), 0)
        self.assertEqual(totals.get('goodCompliance'), 0)
        self.assertEqual(totals.get('basicCompliance'), 0)
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
        url = '/api/companies/Test500/'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'), 'Test500')

    def testCompanyLatestTotal(self):
        url = '/api/company-latest-total-score/Test500'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.data.get('score'), 0)

    def testBarChart(self):
        url = f'/api/analysis/{self.gap.id/bar-chart-data}'
        response = self.client.get(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("categories", respond.data)
        self.assertIn("values", response.data)
        self.assertTrue(all(v == 0 for v in response.data.get("values", [])))

    def scoreOverTime(self):
        url = f'/api/analysis/Test500/total-score-over-time'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("gap_date", response.data)
        self.assertIn("total_score", response.data)
        self.assertEqual(response.data.get("total_score"), [0])

    def testCompanyDeleteView(self):
        url = '/api/companies/Test500/delete'
        response = self.client.delete(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        with self.assertRaises(Company.DoesNotExist):
            Company.objects.get(name='TestDelete')

    def testDeleteCompany(self):
        new_company = Company.objects.create(name = 'testDelete')
        url = '/api/companies/testDelete/'
        response = self.client.delete(url, format = 'json')
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.data)
        with self.assertRaises(Company.DoesNotExist):
            Company.objects.get(name='testDelete')

        
