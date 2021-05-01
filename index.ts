const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const session = require('express-session');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 5000;

// require('./login')

//heroku env var -> mongoDB pw
// const pw = process.env.Mongo_m242;
// const uri = `mongodb+srv://m242:${pw}@cluster0.9rupy.mongodb.net/m242?retryWrites=true&w=majority`;
const uri = `mongodb://127.0.0.1:27017`;
const pw = "";
const client = new MongoClient(encodeURI(uri), { useNewUrlParser: true, useUnifiedTopology: true });

//json parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.post('/user/login', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
  
	if (username && password) {
    client.connect(err => {
      if (err) throw err;

      let query = { "username" : username }
      client.db("nne_dd").collection("users").findOne(query, function(err, result) {
        // console.log(result);
        if(result){
          let hash = result.password;
          if(bcrypt.compareSync(password, hash)){
            req.session.loggedin = true;
            req.session.username = username;
            console.log("correct password");
            // res.redirect('/home');
            res.send("correct password");
          }else{
            console.log("Wrong password");
            res.send("Wrong password");
          }
        }else if(result === null){
          console.log("User not exist");
          res.send("User not exist");
          // res.send(`Not exist`);
        }
      });
    });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.post('/user/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if (username && password) {
    client.connect(err => {
      if (err) throw err;

      let hash = bcrypt.hashSync(password, 10);
      let query = { "username" : username, "password": hash}
      client.db("nne_dd").collection("users").insertOne(query, function(err, res) {
        console.log("User saved");
        res.send("User saved");
      });
    });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

//serve app
// app.use(express.static(path.join(__dirname, 'frontend/')));
//or
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'frontend/src')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/src', 'index.html'));
  });
}

//port listen
app.listen(port, () => {console.log('server running at port: ' + port)})