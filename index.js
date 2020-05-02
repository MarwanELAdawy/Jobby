const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const expressip = require('express-ip');

const handleBars = require('express-handlebars');

app.engine('.hbs',handleBars({extname: '.hbs'}));

app.set("PORT",PORT);

app.use(express.static(path.join(__dirname,'assets')));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','.hbs');
app.locals.layout = false;
app.use(expressip().getIpInfoMiddleware); // registering the middleware

app.get('/',(req, res)=>{
    let url = `https://indreed.herokuapp.com/api/jobs?q=web+developer&limit=50`;
    axios({
        method: 'get',
        url
    })
    .then((response)=>{
        let jobs = response.data;
        res.render("index",{title: "Jobby", jobs: jobs});
    })
    .catch((error)=>{
        console.log(error);
    });
});
app.get('/search', function (req, res) {
    queries = req.query;
    var ipInfo = req.ipInfo;
    let url;
    if (ipInfo.country) {
         url = `https://indreed.herokuapp.com/api/jobs?country=${ipInfo.country}`;
    }
    else{
         url = `https://indreed.herokuapp.com/api/jobs`;
    }
    if (queries){
        axios.get(url, {
        params: queries
    })
    .then((response)=>{
        res.render("search", { title: "Jobby", jobs: response.data});
    })
    .catch((error)=> {
        console.log(error);
    });
    }
    else {
        res.render("search", {title: "Jobby"})
    }
});
app.listen(app.get('PORT'),()=>{
    console.log('Express started on http://localhost:' + app.get('PORT') + '; press Ctrl-C to terminate.');
});