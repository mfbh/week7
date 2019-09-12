let express = require('express');
let app=express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

// html files
let viewsPath = __dirname + "/views";

app.use(express.static("public/img")); // to allow users to view image 
app.use(express.static('css'));
app.engine("html", require('ejs').renderFile);
app.set("view engine" , "html");
app.use(bodyParser.urlencoded({
    extended : false
}
));

// models 
let task = require('./models/task.js');
let developer = require('./models/developer.js');

// mongo db url
let url = "mongodb://localhost:27017/fit2095";




mongoose.connect(url,function(err){
    if (err){
        throw err;
    }

    console.log("succensfully connected")
})


app.get("/",function(req,res){
    let fileName = viewsPath + "/index.html";  
    res.sendFile(fileName);

});

app.get("/newdev.html", function(req,res){ // request first , after that respond
    let fileName = viewsPath + "/newdev.html";
    res.sendFile(fileName);
});

app.get("/newtask.html", function(req,res){ // request first , after that respond
    let fileName = viewsPath + "/newtask.html";
    res.sendFile(fileName);
});
app.get("/updatetask.html", function(req,res){
    let fileName = viewsPath + "/updatetask.html";
    res.sendFile(fileName);
});

app.get("/listdev.html", function(req,res){
    let fileName = viewsPath + "/listdev.html";
    developer.find().exec(function(err,data){
        if(err){
            console.log("No developers found");
        }
        console.log(data)
        res.render(fileName,{
            dev: data
        });
    })

})

app.get("/listtask.html", function(req,res){
    let fileName = viewsPath + "/listtask.html";
    task.find().exec(function(err,data){
        if(err){
            console.log("no task found");
        }
        console.log(data)
        res.render(fileName,{
            task: data
        })
    })
})

app.get("/getcompleted",function(req,res){
    let fileName = viewsPath + "/listtask.html";
    task.where({'taskStatus': 'Complete'}).limit(3).sort({taskName:-1}).exec(function(err,data){
        if(err){
            console.log("no task found");
        }
        console.log(data)
        res.render(fileName,{
            task: data
        })
    })
})

app.get("/deletetask.html", function(req,res){
    let fileName = viewsPath + "/deletetask.html";
    res.sendFile(fileName);
});

app.get("/deletecompleted", function(req,res){
    task.deleteMany({taskStatus : 'Complete'},function (err, doc) {
        console.log(doc);
    });
    res.redirect("/listtask.html")
})


app.post("/addNewDev",function(req,res){
    console.log(req.body);
    let dev = req.body;
    developer.create({
        _id : new mongoose.Types.ObjectId(),
        name: {
            firstName: dev.firstName,
            LastName: dev.lastName

        },
        level: dev.level,
        address:{
            state : dev.state,
            suburb: dev.suburb,
            street : dev.street,
            unit: dev.unit
        }
        
    })
    res.redirect('/listdev.html')

})



app.post("/addNewTask", function(req,res){
    console.log(req.body);
    let newId= Math.round(Math.random() * 1000);
    let newTask = req.body;
    task.create({
        taskID : newId,
        taskName: newTask.taskName,
        assignedTo: newTask.devID,
        dueDate : newTask.taskDue,
        taskStatus : newTask.status,
        taskDesc : newTask.description


    })
    res.redirect('/listtask.html')
})    

app.post("/deleteOneTask",function(req,res){
    let selectId = req.body;
    task.deleteOne({taskID: parseInt(selectId.task_id)},function (err, doc) {
        console.log(doc);
    });
    res.redirect("/listtask.html")
});

app.post("/updatetask", function(req,res){
    let selectId= req.body;
    let filter = {taskID: parseInt(selectId.task_id)};
    let theUpdate = { $set: { taskStatus: selectId.status } } ;
    task.updateOne(filter,theUpdate,function (err, doc) {
        console.log(doc);
    });
        
    res.redirect("/listtask.html")

});



app.listen(8080);