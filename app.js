'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride= require('method-override');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine','ejs');

const client = new pg.Client(process.env.DB_URL);
const PORT = process.env.PORT;

client.connect().then(()=>{
  app.listen(PORT,()=>{
    console.log(`i am on port ${PORT}` );
  });
});


app.get('/',(req,res)=>{
  let url = 'https://api.covid19api.com/world/total';
  superagent(url).then((data)=>{
    let worldTotal = data.body;
    return res.render('pages/index',{world:worldTotal});
  });

});

app.get('/getCountryRes',(req,res)=>{
  let { country, date1, date2 } = req.query; // req query with names;

  let url = `https://api.covid19api.com/country/${country}?from=${date1}&to=${date2}`;
  superagent(url).then((data)=>{
    let countryCases= data.body;
    let casesMap = countryCases.map((item,i)=>{
      return new Case(item);
    });
    res.render('pages/countryRes',{cases:casesMap});

  });
});

function Case(val){
  this.date=val.Date;
  this.case=val.Confirmed;
  this.country=val.Country;
}















