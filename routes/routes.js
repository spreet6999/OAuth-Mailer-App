const router = require('express').Router();
const fetch = require('node-fetch');
var btoa = require('btoa');

let User = {
    "emailID": "",
    "access_token": "",
    "refresh_token": ""
}

router.get('/login', async (req, res) => {
    // First Hitting to the Google api with our CLIENT_ID and CLIENT_SECRET and Authorization Scope
    // To get an access code.
    const api_url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://mail.google.com/&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&client_id=${process.env.CLIENT_ID}`
    res.redirect(api_url);
})

router.get('/redirect',async (req, res) => {
    const CODE = req.query.code;
    // console.log(req.headers);
    // console.log(CODE);
    
    //  With this access code we can now hit the specific api to get the access_token and refresh_token
    //  after our user allows us for various permissions.

    if(CODE){
        const api_url = `https://oauth2.googleapis.com/token?code=${CODE}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri=${process.env.REDIRECT_URI}&grant_type=authorization_code`
        const token_url = `https://gmail.googleapis.com/gmail/v1/users/me/profile`
        fetch(api_url, {method: 'post'})
        .then(resp => resp.json())
        .then((json) => {
            User.access_token = json.access_token;
            User.refresh_token = json.refresh_token;
            // console.log(User.access_token);

            //  Uptill here User is Logged in and we have tokens to access information.
            //  Using the access token I called the getProfile API of Gmail to get the emailAddress
            //  of the logged in user.

            fetch(token_url, 
            {
                method: "get",
                headers: {
                    "Authorization": `Bearer ${json.access_token}`,
                }
            })
            .then(resp => resp.json())
            .then(json => {
                User.emailID = json.emailAddress;
                // console.log(User);
                res.send("Successfully Logged in as " + User.emailID);
            })});
    }
    else
        res.send("Something Went Wrong!");
    
});


//  This route is built for the logged in user to view his/her gmail profile.
router.get('/profile', async(req, res) => {
    if(User.access_token == "" || User.emailID == "" || User.refresh_token == ""){
        res.send("Invalid Grant - Access Denied");
    }
    else{
        const token_url = `https://gmail.googleapis.com/gmail/v1/users/${User.emailID}/profile`;
        fetch(token_url,
            {
                method: "get",
                headers: {
                    "Authorization": `Bearer ${User.access_token}`,
                }
            })
            .then(resp => resp.json())
            .then(json => {
                User.emailID = json.emailAddress;
                // console.log(User);
                res.send("Your Email: " + User.emailID);
            })
    }
})

//  This route is built for logged in user to send Mail to the specified emailId in the route.
//  Which goes like: /sendMail/testUser@example.com

router.post('/sendMail/:emailId', (req, res) => {
    if(User.access_token == "" || User.emailID == "" || User.refresh_token == ""){
        res.send("Please Login First");
    }
    else{
        const api_url = `https://gmail.googleapis.com/gmail/v1/users/${User.emailID}/messages/send`;

        //  Providing message in the string format as shown below:
        //  To: <test@example.com>
        //  Subject: XYZ
        //  
        //  {Here goes your message}.
        const bodyString = `To:<${req.params.emailId}>\nSubject: Testing API\n\nThis is the message - Happy Coding :)`;
        const bodyBase64 = btoa(bodyString);

        //  Passing Message encoded in Base64 in the body of the request to hit the Gmail API
        
        fetch(api_url, 
            {
                method: "post",
                
                body: JSON.stringify({
                    "raw": bodyBase64
                }),
                
                headers: {
                    "Authorization": `Bearer ${User.access_token}`,
                    "Content-Type": "application/json",
                }
            })
            .then(resp => resp.json())
            .then(json => res.send(json))
            
        console.log("Its Working!");
    }
})

module.exports = router;