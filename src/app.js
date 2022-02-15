const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const path = require('path');
const requests = require('requests');
const hbs = require('hbs');
const { stat } = require('fs');

const staticPath = path.join(__dirname,'../public');
const partialsPath = path.join(__dirname,'../views/partials');
app.set('view engine','hbs');
app.use(express.static(staticPath));
hbs.registerPartials(partialsPath);
app.get('/',(req,resp) => {
    resp.render('index');
});

app.get('/about',(req,resp) => {
    resp.render('about');
});


app.get('/weather',(req,resp) => {
    let city = req.query.city;
    if(city){
    var resps = false;
    requests(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e4be21456e97942af089df1724806101`)
        .on('data',(chunk) => {

            const objData = JSON.parse(chunk);
            if(objData.cod == 200){
                const arrData = [objData];
                const orgVal = arrData[0];
                console.log(objData.cod);
            // resp.write( orgVal.main.temp);
                //const realTimeData = arrData.map((val) => replaceVal(homeFile,val)).join('');
                resp.render('weather',{
                tempval : orgVal.main.temp,
                tempmin : orgVal.main.temp_min,
                    tempmax : orgVal.main.temp_max,
                    location : orgVal.name,
                    country : orgVal.sys.country,
                    tempStatus : orgVal.weather[0].main,
                    city : city,

                });
            }else{
                resp.render('weather',{
                    location : 'City Not Found',
                });
            }
        })
        .on('end',(err) =>{
            if(err) return console.log('conn closed');
            console.log('end');
        });
    }else{
        resp.render('weather');
    }
    
});

app.get('*',(req,resp) => {
    resp.render('404');
});

app.listen(port,(req,resp) => {
    console.log(`Listening to port ${port}`);
})