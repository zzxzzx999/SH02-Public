## GAP Analysis Project
Perform, store and view GAP analysis data for a company or individual. It assesses the effort done to follow Health and Safety regulations through a questionnaire with 12 categories and 10 questions per category. At the end of the questions the website will display the data as graphs and metrics achieved. On the company's page it will show a brief description of the company as well as their latest scores through line and bar charts. The download icon, when pressed, will create the PDF plan of all the data recorded from the GAP analysis. Additionally, the user can click on the various dates below the companies description to view past results. When the user goes on detailed results, they will be greeted by their scores in each section with a piechart, tally and points. The user can login from two different types of accounts, a consultant account and an admin account. The consultant account does not have access to the list of companies page and will have to search for companies through the search bar. Users can add new companies and fill out details related to the individuals being contacted at the company and which consultant is conducting the GAP Analysis. In the list of companies, the user can sort order by score and view the latest GAP score of companies as well as delete companies.

## Important information on branches
# The main branch is for local hosting
# The production branch is for updating images on dockerhub and deploying

# Quickstart - Local Hosting

Install dockerhub and postresql and Node.js
You will need to install python, open 2 command lines then do the following commands:
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh02/sh02-main.git

cd SH02-main
cd gap_project
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

On the 2nd command line:

cd SH02-main
cd gap_project
cd frontend
npm install
npm start


You can now use the project. Use it through http://localhost:3000

# Example Usage 
# Authentication and logging in:

There are two types of logins on the website, an admin view and a consultant view.
The consultant view blocks the company list. To create an account with the admin view just call the username GAPAdmin.
To login create an account run the command:

python manage.py createsuper

And fill in the with a

# Running tests 

To run tests for:
     the backend run:
          python manage.py tests
     the frontend run:
          npm run test

# Updating models

If changes are made to the models, run:

python manage.py makemigrations
python manage.py migrate

