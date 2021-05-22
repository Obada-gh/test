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
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

const client = new pg.Client(process.env.DB_URL);
const PORT = process.env.PORT;

client.connect().then(()=>{
  app.listen(PORT,()=>{
    console.log(`i am on ${PORT}`);
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
    let casesMap = countryCases.map((item)=>{
      return new Case(item);//foreach
    });
    res.render('pages/countryRes',{cases:casesMap});//foreach

  });
});

function Case(val){
  this.dates=val.Date;
  this.cases=val.Confirmed;
  this.country=val.Country;
}

app.get('/allcountrys',(req,res)=>{
  let url = 'https://api.covid19api.com/summary';
  superagent(url).then((data)=>{
    let summary = data.body.Countries;
    // console.log(summary);
    let mapSum = summary.map((item)=>{
      return new SummaryCons(item); //foreach
    });

    return res.render('pages/allcountrys',{countries:mapSum});//foreach
  });
});
function SummaryCons(sumD){
  this.country = sumD.Country;
  this.totalconfirmed = sumD.TotalConfirmed;
  this.totaldeaths = sumD.TotalDeaths;
  this.totalrecovered = sumD.TotalRecovered;
  this.dates = sumD.Date;
}
//button to add in allcountry//form hidden//post method//query
app.post('/addtomyrecords',(req,res)=>{
  // console.log(req.body);
  let { country,totalconfirmed,totaldeaths,totalrecovered,dates } = req.body;
  let sql = 'INSERT INTO records (country,totalconfirmed,totaldeaths,totalrecovered,dates) VALUES ($1,$2,$3,$4,$5) RETURNING *;';
  let val =  [country,totalconfirmed,totaldeaths,totalrecovered,dates];
  client.query(sql,val).then(()=>{
    return res.redirect('/records');
  });
});

app.get('/records',(req,res)=>{
  let sql = 'SELECT * FROM records;';
  client.query(sql).then((data)=>{
    return res.render('pages/record',{records:data.rows});
  });
});
//WHERE ID inside the form and the roots
app.get('/details/:id',(req,res)=>{
  let sql = `SELECT * FROM records WHERE id=${req.params.id};`;
  client.query(sql).then((data)=>{
    // console.log(data);
    return res.render('pages/details',{sdetails:data.rows[0]});
  });

});

//redirect for the root //render for data
app.delete('/delete/:id',(req,res)=>{
  let sql = 'DELETE FROM records WHERE id=$1';
  let val = [req.params.id];
  client.query(sql,val).then(()=>{
    return res.redirect('/records');
  });
});

app.put('/update/:id',(req,res)=>{
  let { country,totalconfirmed,totaldeaths,totalrecovered,dates } = req.body;
  let sql = 'UPDATE records SET country=$1,totalconfirmed=$2,totaldeaths=$3,totalrecovered=$4,dates=$5 WHERE id=$6;';
  let val = [country,totalconfirmed,totaldeaths,totalrecovered,dates,req.params.id];
  client.query(sql,val).then(()=>{
    return res.redirect(`/details/${req.params.id}`);
  });
});























