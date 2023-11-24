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
