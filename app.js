var mongodb=require('mongodb').MongoClient;
var express=require('express');
var app=express();
var bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');

const url="mongodb://localhost:27017";
const dbName="TODOApp";
var db;
mongodb.connect(url,{ useUnifiedTopology: true } ,(err,database)=>{
    console.log("database connected")
   db=database.db(dbName); 
   if(err){
       console.error(err);
   }

});

app.post('/addMessage',async (req,res)=>{
    console.log(req.body)
  var data={

      "message":req.body.message,
      "timestamp":Date.now()
  }  
 var response=await db.collection('todo').insertOne(data)
 //res.send(response)
 res.redirect('/')

})
app.get('/deleteMessage/:timestamp',async (req,res)=>{
    
   var timestamp=req.params.timestamp
    var response=await db.collection('todo').deleteOne({timestamp : Number(timestamp)})
    res.send(response);
    
})

app.listen(3000,()=>console.log("server started"));
app.get('/getMessage',async (req,res)=>{
    var response=await db.collection('todo').find().sort({timestamp:-1}).toArray();
    res.send(response);
})
app.get('/',async(req,res)=>{
    var response=await db.collection('todo').find().sort({timestamp:-1}).toArray();
    res.render("app.ejs", { todoTasks: response });
})