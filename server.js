const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');

const app = express();

// Set up middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (but not HTML files directly)
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
//app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', (req, res) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname;
    const email = req.body.email;
    console.log(firstname, lastname, email);
    const apikey ="7377025eb870e4eac99b87076e7fe632-us14";
    const listId = "5e56b700c2";
    //const serverPrefix = 'us14';
    const url ="https://us14.api.mailchimp.com/3.0/lists/5e56b700c2";
    const options = {
        method: "POST",
        auth: "ss:7377025eb870e4eac99b87076e7fe632-us14"
    }
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
        response.on("end", () => {
            if (response.statusCode === 200) {
                // Successful response from Mailchimp
                res.json({ message: 'Subscription successful', firstname, lastname });
            } else {
                // Failed response from Mailchimp
                res.status(response.statusCode).json({ message: 'Subscription failed' });
            }
        });
    })
    request.write(jsonData);
    request.end();
    console.log(firstname,lastname,email);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

