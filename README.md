# MEGAK_HH_SPEC_G1_backend

## Endpoints

### POST /auth/login

Authenticate and log in a user.<br/>
Example json:<br/>
{<br/>
"email": "blabla@example.com",<br/>
"password": "mocneDycht_haslo123"<br/>
}<br/>

### GET /auth/user

Get logged user data when the user is logged in.

### GET /auth/logout

Log out user.

### POST /user/change-password

Activation of the option to change the password and send an e-mail with a link to change your password.<br/>
Example json:<br/>
{<br/>
"email": "blabla@example.com"<br/>
}<br/>

### POST /user/new-password

Set the new password after clicking on the appropriate link in the email.<br/>
Example json:<br/>
{<br/>
"email": "blabla@example.com", // provided by the user<br/>
"password": "1234", // provided by the user<br/>
"id": "5844ce49-13e4-4940-92bb-7e16c873cd60", // comes from the link<br/>
"token": "c572ef7f-39f7-4ee2-af29-49c559c44a14" // comes from the link<br/>
}<br/>

### POST /user/import

Import students list from local .csv file.<br/>
Example json:<br/>
{<br/>
"path":"D:/KURS JS/students.csv"<br/>
}<br/>

### GET /student/list?

Avalaible query params:

- @param {number[]} [cc=null] - Course Completion degree, takes Array of numbers
- @param {number[]} [ce=null] - Coures Engagement degree, takes Array of numbers
- @param {number[]} [pd=null] - Project Degree, takes Array of numbers
- @param {number[]} [tpd=null] - Team Project Degree, takes Array of numbers
- @param {number[]} [ewt=null] - Work Type, Takes Array of the following: 0 - No Preferences, 1 - On Site, 2 - Relocation, 3 - Remote, 4 - Hybrid
- @param {number[]} [ect=null] - Contract Type, Takes Array of the following: 0 - No Preferences, 1 - UoP, 2 - B2B, 3 - UZorUoD
- @param {[number, number]} [es=null] - Expected Salary, Takes array of two values, lower border at first and upper border on second index
- @param {boolean, number} [cta=null] - Can Take Apprenticeship, empty = false otherwise true
- @param {number} [moce=0] - Months of minimum commercial experiecne, takes number of months
- @param {string} [srch=null] - Search String
- @param {number} [page] - Number of page
- @param {number} [pitems] - Number of elements per page
