DROP TABLE IF EXISTS records;


CREATE TABLE IF NOT EXISTS records (

    id SERIAL PRIMARY KEY,
    country varchar(255),
    totalConfirmed varchar(255),
    totalDeaths varchar(255),
    totalRecovered varchar(255),
    dates varchar(255)
    
);






