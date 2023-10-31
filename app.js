require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const axios = require("axios");

const app = express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

const clientID=process.env.CLIENT_ID;
const clientSecret=process.env.CLIENT_SECRET;
const scopes = 'user_profile';
const redirectURI = 'https://todolist-cuoe.onrender.com/'

app.get("/",function(req,res){
    
    res.render("home");
})

app.get("/auth/instagram",function(req,res){
    console.log(clientID);
    const authorizationURL = `https://api.instagram.com/oauth/authorize/?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scopes}&response_type=code`;
    res.redirect(authorizationURL);
})

app.get("/callback", async function(req,res)
{
    console.log("Process started33");
    const code = req.query.code;

    try{
        console.log("Process started");
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token',null,{
         params: {
            client_id: clientID,
            client_secret: clientSecret,
            grant_type:'authorization_code',
            redirect_uri: redirectURI,
            code: code,
         },
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },   
        });
        const accessToken = tokenResponse.data.access_token; // Access Token
        const userID = tokenResponse.data.user_id; // User ID
        console.log(accessToken,userID);
        res.json({ access_token: accessToken, user_id: userID });
        console.log(accessToken,userID);
    } catch (error) {
        console.error('Error',error);
        res.status(500).send('Error for code');
    }
});

app.listen(5000,function(){
    console.log("Server started on port 5000.")
});