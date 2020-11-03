##This is the Backend app to consime Gmail REST APIs without using any client Library

##Here is the procedure to run this project:

Run npm i

##Make sure you have made a project in the google developer console
##And enabled Gmail API From there
##Note down the Keys provided after a successful setup of project

##Make a .env file of the following:
    CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

##Here is the list of all the api endpoints:

goto:
    /api/google/login 
    to make a OAuth Google login.

    /api/google/profile
    to see your gmail profile

    /api/google/sendMail/{emailId}
    where the emailId is the receiver's Email Address

##For Now User Credentials after a successful login are stored in variables
##But for future scope one can store it in a separate file using filesytem methods.

##Happy Coding :)