from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from django.urls import reverse

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
        
        self.gap.save()

    def testLogin(self): #loginView
        url = '/api/login/'
        data = {'username': 'testAccount', 'password': 'Test500'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        selfassertIn('token', response.data)

    def test_get_scores(self):
