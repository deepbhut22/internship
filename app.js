//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const https = require('https');
const { log } = require("console");

mongoose.connect("mongodb://127.0.0.1:27017/int");
const app = express();

const sschema = new mongoose.Schema({
    name:String,
    last:String,
    buy:String,
    sell:String,
    volume:String,
    base_unit:String
})

const tab = mongoose.model("tab" , sschema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url  = "https://api.wazirx.com/api/v2/tickers";
// var f = 0;
// if(f === 0){
    https.get(url, function(response) {
        let data = '';
        response.on('data', function(chunk) {
            data += chunk;
        });
        response.on('end', function() {
            const result = JSON.parse(data);
            const key = Object.keys(result);
            for(var i=0 ; i<10 ; i++){
                const obj = result[key[i]];
                const ans = new tab({
                    name: obj.name,
                    last: obj.last,
                    buy: obj.buy,
                    sell: obj.sell,
                    volume: obj.volume,
                    base_unit: obj.base_unit
                })
                ans.save();
            }
        });
        // f = 1;
    }).on("error", function(error) {
        console.log("Error: " + error.message);
    });
// }
    app.get("/" , function(req,res){
        tab.find().then((data)=>{
                res.render("a" , {obj : data});
        })
    })
    
    
    
    
    
    
// })


app.listen(3000 , ()=>{
    console.log("server running on port 3000");
})