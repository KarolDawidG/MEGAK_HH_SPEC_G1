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
	"email": "fff@gmail.com", // provided by the user<br/>
	"password": "1234", // provided by the user<br/>
	"id": "5844ce49-13e4-4940-92bb-7e16c873cd60", // comes from the link<br/>
	"token": "c572ef7f-39f7-4ee2-af29-49c559c44a14" // comes from the link<br/>
}<br/>
