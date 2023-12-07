# MEGAK_HH_SPEC_G1_backend

## Endpoints

### POST /auth/login

Authenticate and log in a user.<br/>
Example json:
```
{
"email": "blabla@example.com",
"password": "mocneDycht_haslo123"
}
```

### GET /auth/user

Get logged user data when the user is logged in.

### GET /auth/logout

Log out user.

### POST /user/change-password

Activation of the option to change the password and send an e-mail with a link to change your password.<br/>
Example json:
```
{
"email": "blabla@example.com"
}
```

### PATCH /user/change-self-password

Allows user to change password and send an e-mail with information about password change.<br/>
Example json:
```
{
    "password": "1234",
	"newPassword": "12345",
	"repeatNewPassword": "12345"
}
```

### POST /user/new-password

Set the new password after clicking on the appropriate link in the email.<br/>
Example json:
```
{
"password": "1234", // provided by the user
"id": "5844ce49-13e4-4940-92bb-7e16c873cd60", // comes from the link
"token": "c572ef7f-39f7-4ee2-af29-49c559c44a14" // comes from the link
}
```

### POST /user/import

Import students list<br/>
Example json:
```
[
{"email":"efylan0@xinhuanet.com","courseCompletion":"0","courseEngagement":"0","projectDegree":"0","teamProjectDegree":"2","bonusProjectUrls":"[https://github.com/gsdfgfsdg,https:/
/github.com/gsdfgfsdg453466]"},
{"email":"idesport1@toplist.cz","courseCompletion":"5","courseEngagement":"1","projectDegree":"4","teamProjectDegree":"0","bonusProjectUrls":"[https:/
/github.com/fdfsgsdgdfsfdsg]"},
{"email":"bcleminson2@cam.ac.uk","courseCompletion":"0","courseEngagement":"2","projectDegree":"5","teamProjectDegree":"3","bonusProjectUrls":"[https:
//github.com/rtetewrtet/]"}
]
```
<br/>
Example .csv file:<br/>
https://www.dropbox.com/scl/fi/t2yjimwfibyhz7i6b0i9v/students.csv?rlkey=9jzoctqf5cmf6rbvyk79she0j&dl=0<br/>

### POST /user/add-hr

Adding new HR user.<br/>
Example json:
```
{
"email": "test@gmail.com",
"fullName": "Name Surname",
"company": "LuxCompany",
"maxReservedStudents": "84"
}
```

### POST /user/add-admin

Adding new admin user.<br />
Example json:
```
{
"email": "test@gmail.com"
}
```

### POST /user/register

Register (activate) user.
Example json:
```
{
"password": "1234", // provided by the user
"id": "5844ce49-13e4-4940-92bb-7e16c873cd60", // comes from the link
"token": "c572ef7f-39f7-4ee2-af29-49c559c44a14" // comes from the link
}
```

### GET /student/list?page=<pageNumber>

Get student List.<br/>
Page number cannot be lower than 1.
Available query params (Should be separated with & in address, empty params will be ignored):

- cc - Course Completion degree, takes Array of numbers
- ce - Courses Engagement degree, takes Array of numbers
- pd - Project Degree, takes Array of numbers
- tpd - Team Project Degree, takes Array of numbers
- ewt - Work Type, Takes Array of the following: 0 - No Preferences, 1 - On Site, 2 - Relocation, 3 - Remote, 4 - Hybrid
- ect - Contract Type, Takes Array of the following: 0 - No Preferences, 1 - UoP, 2 - B2B, 3 - UZorUoD
- es - Expected Salary, Takes array of two values, lower border at first and upper border on second index
- cta - Can Take Apprenticeship, empty = false otherwise true
- moce - Months of minimum commercial experiecne, takes number of months
- srch - Search String (Search only city name)
- page - Number of page
- pitems - Number of elements per page (Default 15)

Returns:

```
[
  studentsList[]: {
    firstName: string;
    lastName: string;
    "expectedWorkType": number,
    "targetWorkCity": string,
    "expectedContractType": number,
    "expectedSalary": number,
    "canTakeApprenticeship": 0 | 1 (boolean/number),
    "monthsOfCommercialExperience": number,
    "projectDegree": number,
    "teamProjectDegree": number,
    "courseCompletion": number,
    "courseEngagemnet": number
  },
  number - Total DB records count
]
```
