## GAP Analysis Project
Perform, store and view analysis data for a company or individual. 
The user can login from two different types of accounts, a consultant account and an admin account. 

### Admin view
The user can access the list of companies, and can add new companies.
When the user clicks on a company's name through the lsit of companies page, they will be taken to the company's dashboard.
 - Will show the most recent analysis data (shown as graphs).
 - Click the download button to recieve the improvement plan for that analysis.
 - Select a date to view the dashboard for the desired date of the analysis.
 - Click the view results button to view the results of the selected analysis.

### Consultant view
User can add a new company and search for a company. 
 - The searched company will come up with start analysis or resume (if the analysis was rpeviosuly saved but not finished)

Once selecting resume/start analysis, the users will be taken to the Analysis question page, where they will answer few questions along with evidence and improvement text.
 - They can save and come back later, or finish and go to results. If they finish, they will be taken to the results of the analysis.

### Results Page
The results page shows an overview page, with the total score out of 600 and some graphs. Through the navbar, you can select a section to view - this will show it's detailed score out of 50.

# Important information on branches
1. The main branch is for local hosting
2. The production branch is for updating images on dockerhub and the deployed website.

# Quickstart - Local Hosting
Install Git:
 - https://git-scm.com/downloads
Install DockerHub:
 - https://docs.docker.com/desktop/setup/install/windows-install/
Install Node.js v22.11.0:
 - https://nodejs.org/en/download 
Install Python v3.12:
 - https://www.python.org/downloads/

Open 2 command lines then do the following commands:
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2024/sh02/sh02-main.git

1. cd SH02-Public
2. cd gap_project
3. pip install -r requirements.txt
4. python manage.py migrate
5. python manage.py runserver

On the 2nd command line:

1. cd SH02-Public
2. cd gap_project
3. cd frontend
4. npm install
5. npm start

You can now use the project. Use it through http://localhost:3000
If you need to view the api, use it through http://localhost:8000 
(the numbers at the end of the link may change on the port numbers assigned to the terminal)

# Quickstart - Using Production Branch
No need to install everything again, however you need PostGreSQL V17 for the database:
 - https://www.postgresql.org/download/ 

You can access the frontend link using: 
 - https://gordon-foley-frontend.onrender.com/
Access the backend API:
 - https://gordon-foley-backend.onrender.com/

**NOTE**: These links will not work apst the 30th of March due to the database service running out of its free service. If you wish to access this after this date, use it locally.

# Example Usage 
Authentication and logging in:

There are two types of logins on the website, an admin view and a consultant view.
The consultant view blocks the company list. To create an account with the admin view you set the username GAPAdmin. Any other username will be default to a consultant.

### To login create an account run the command
 - python manage.py createsuper
And fill in the details.

### Running tests 

To run the tests for the backend, open a terminal and run:
 - python manage.py tests

To run the tests for the frontend, open a terminal and run:
 - npm run test

### Updating models

If changes are made to the models, run:
 - python manage.py makemigrations
 - python manage.py migrate

# Members
Juliana Cristina Green
Ameer Azlan Shah
Jessica Neil
Tom Hossel
Zhixuan Zhu 
Berk Ergezer
