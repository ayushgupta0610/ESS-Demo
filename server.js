var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
var request = require('request');
// var path = require('path');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static( "public" ));
app.get('/', (req, res) => {
    res.render('index');
});

var fileName;

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        fileName = file.originalname;
        callback(null, file.originalname);
    }
});

var upload = multer({storage: storage}).single('myFile');
    app.post('/upload', function (req, res, next) {

    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        console.log('./uploads/', fileName);
        var options = {
                url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/4b1d21b5-8b08-40b1-bc37-3674e30c75e6/image',
                headers: {
                  'User-Agent': 'request',
                  'Prediction-key': '0bcd5389efb548a5b76f2657af37876d',
                  'Content-type': 'image/jpg'
                },
                body: fs.createReadStream('./uploads/' + fileName)
                // body: fs.createReadStream(req.files.path)
              };
            request.post(
                options,
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                        // res.write('<link rel="stylesheet" href="../css/style.css">');
                        res.writeHead(200, {'Content-type': 'text/html'});
                        res.write(`<style>
                        #uploadForm{
                            padding-top: 20px;
                            display: flex;
                            justify-content: space-between;
                        }
                        input.btn{
                            flex: 0.8;
                        }
                        button.btn{
                            flex: 0.15;
                        }
                
                        @import url(https://fonts.googleapis.com/css?family=Roboto:300);
                
                        .login-page {
                        width: 360px;
                        padding: 8% 0 0;
                        margin: auto;
                        }
                        .form {
                        position: relative;
                        z-index: 1;
                        background: #FFFFFF;
                        max-width: 360px;
                        margin: 0 auto 100px;
                        padding: 45px;
                        text-align: center;
                        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
                        }
                        .form input {
                        font-family: "Roboto", sans-serif;
                        outline: 0;
                        background: #f2f2f2;
                        width: 100%;
                        border: 0;
                        margin: 0 0 15px;
                        padding: 15px;
                        box-sizing: border-box;
                        font-size: 14px;
                        }
                        .form button {
                        font-family: "Roboto", sans-serif;
                        text-transform: uppercase;
                        outline: 0;
                        background: #4CAF50;
                        width: 100%;
                        border: 0;
                        padding: 15px;
                        color: #FFFFFF;
                        font-size: 14px;
                        -webkit-transition: all 0.3 ease;
                        transition: all 0.3 ease;
                        cursor: pointer;
                        }
                        .form button:hover,.form button:active,.form button:focus {
                        background: #43A047;
                        }
                        .form .message {
                        margin: 15px 0 0;
                        color: #b3b3b3;
                        font-size: 12px;
                        }
                        .form .message a {
                        color: #4CAF50;
                        text-decoration: none;
                        }
                        .form .register-form {
                        display: none;
                        }
                        .container {
                        position: relative;
                        z-index: 1;
                        max-width: 300px;
                        margin: 0 auto;
                        }
                        .container:before, .container:after {
                        content: "";
                        display: block;
                        clear: both;
                        }
                        .container .info {
                        margin: 50px auto;
                        text-align: center;
                        }
                        .container .info h1 {
                        margin: 0 0 15px;
                        padding: 0;
                        font-size: 36px;
                        font-weight: 300;
                        color: #1a1a1a;
                        }
                        .container .info span {
                        color: #4d4d4d;
                        font-size: 12px;
                        }
                        .container .info span a {
                        color: #000000;
                        text-decoration: none;
                        }
                        .container .info span .fa {
                        color: #EF3B3A;
                        }
                        body {
                        background: #76b852; /* fallback for old browsers */
                        background: -webkit-linear-gradient(right, #76b852, #8DC26F);
                        background: -moz-linear-gradient(right, #76b852, #8DC26F);
                        background: -o-linear-gradient(right, #76b852, #8DC26F);
                        background: linear-gradient(to left, #76b852, #8DC26F);
                        font-family: "Roboto", sans-serif;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;      
                        }
                    </style>`);
                        res.write(`<div class="login-page">
                                    <div class="form">
                                    
                                    <form class="login-form">`);
                        // res.write(`<img src="${'/uploads/' + fileName}" />`);
                        res.write(`File Name: ${fileName}`);
                        res.write(`<img src="/uploads/brokenwindow.jpg" />`);
                        res.write(`<h4>${JSON.parse(body).predictions[0].tagName.toUpperCase()}: ${(JSON.parse(body).predictions[0].probability*100)}%</h4>
                                        <h4>${JSON.parse(body).predictions[1].tagName.toUpperCase()}: ${(JSON.parse(body).predictions[1].probability*100)}%</h4>
                                    </form>

                                    </div>
                                </div>`);
                    }
                }
            );
        
        // res.end("Upload completed.");
    });
})

app.listen(3000);
