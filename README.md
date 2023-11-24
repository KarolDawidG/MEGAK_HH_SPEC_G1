# MEGAK_HH_SPEC_G1_backend

## Endpoints

### POST /auth/login
Authenticate and log in a user.
Example json:
{
"email": "blabla@example.com",
"password": "mocneDycht_haslo123"
}

### GET /auth/user
Get logged user data when the user is logged in.

### GET /auth/logout
Log out user.

### POST /user/change-password
Activation of the option to change the password and send an e-mail with a link to change your password.
Example json:
{
"email": "blabla@example.com"
}

### POST /user/new-password
Set the new password after clicking on the appropriate link in the email.
Example json:
{
	"email": "fff@gmail.com", // provided by the user
	"password": "1234", // provided by the user
	"id": "5844ce49-13e4-4940-92bb-7e16c873cd60", // comes from the link
	"token": "c572ef7f-39f7-4ee2-af29-49c559c44a14" // comes from the link
}
