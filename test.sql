DROP TABLE IF EXISTS records;


CREATE TABLE IF NOT EXISTS records (

    id SERIAL PRIMARY KEY,
    country varchar(255),
    totalconfirmed varchar(255),
    totaldeaths varchar(255),
    totalrecovered varchar(255),
    dates varchar(255)
    
);


INSERT INTO records (country,totalconfirmed,totaldeaths,totalrecovered,dates) VALUES ('$1','$2','$3','$4','$5')





