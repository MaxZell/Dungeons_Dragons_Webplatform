app.post('user/auth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let query = { "username" : username}
  
    if (username && password) {
        client.connect(err => {
            console.log('Mongo Error: ', err)
            client.db("nne_dd").collection("users").findOne(query, function(err, result) {
                if (err) throw err;
                if(result){
                    let hash = result.password;
                    if(bcrypt.compareSync(password, hash)){
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/home');
                    } else{
                        console.log("Wrong password");
                    }
                } else if(result == null){
                    res.send(`Not exist`);
                }
                console.log(result);
            });
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
  });
  
app.post('user/login', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let hash = bcrypt.hashSync(password, 10);
    let query = { "username" : username, "password": hash}
  
    if (username && password) {
    client.connect(err => {
    console.log('Mongo Error: ', err)
    client.db("nne_dd").collection("users").insertOne(query, function(err, res) {
        if (err) throw err;
            console.log("User saved");
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