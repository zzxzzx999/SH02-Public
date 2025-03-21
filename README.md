## GAP Analysis Project
Perform, store and view GAP analysis data for a company or individual. It assesses the effort done to follow Health and Safety regulations through a questionnaire with 12 categories and 10 questions per category. At the end of the questions the website will display the data as graphs and metrics achieved. On the company's page it will show a brief description of the company as well as their latest scores through line and bar charts. The download icon, when pressed, will create the PDF plan of all the data recorded from the GAP analysis. Additionally, the user can click on the various dates below the companies description to view past results. When the user goes on detailed results, they will be greeted by their scores in each section with a piechart, tally and points. The user can login from two different types of accounts, a consultant account and an admin account. The consultant account does not have access to the list of companies page and will have to search for companies through the search bar. Users can add new companies and fill out details related to the individuals being contacted at the company and which consultant is conducting the GAP Analysis. In the list of companies, the user can sort order by score and view the latest GAP score of companies as well as delete companies.

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

1. cd SH02-main
2. cd gap_project
3. pip install -r requirements.txt
4. python manage.py migrate
5. python manage.py runserver

On the 2nd command line:

1. cd SH02-main
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

You can access the frontend link using: https://gordon-foley-frontend.onrender.com/
Access the backend API: -	https://gordon-foley-backend.onrender.com/

**NOTE**: These links will not work apst the 30th of March due to the database service running out of its free service. If you wish to access this after this date, use it locally.

# Example Usage 
Authentication and logging in:

There are two types of logins on the website, an admin view and a consultant view.
The consultant view blocks the company list. To create an account with the admin view you set the username GAPAdmin. Any other username will be default to a consultant.

## To login create an account run the command
 - python manage.py createsuper
And fill in the details.

## Running tests 

To run the tests for the backend, open a terminal and run:
 - python manage.py tests

To run the tests for the frontend, open a terminal and run:
 - npm run test

## Updating models

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

# Proprietary Licence
This software is the **proprietary intellectual property** of the members of SH02, developed as part of an academic project.

**All rights reserved.**

- This codebase is for internal use only.
- It may not be copied, modified, distributed, or used in any form without explicit written permission from SH02.
- This project is not open source and is not available for public or commercial use.