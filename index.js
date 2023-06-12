const express = require("express")
const cors = require("cors")
const mongoose =  require("mongoose")

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

const pass = encodeURIComponent(process.env.PASS);
const user = process.env.USER;
var db1 = mongoose.connect('mongodb+srv://'+user+':'+pass+'@cluster0.rseim.mongodb.net/myKeeperAppDB',{useNewUrlParser:true, useUnifiedTopology:true});
var db = mongoose.connection;

const keeperSchema = {
    title: String,
    content: String
}

const Keeper = mongoose.model("Keeper", keeperSchema);

app.get("/api/getAll",(req,res)=> {
    Keeper.find({}).then(function(KeeperList){
        res.send(KeeperList);
    })
})

app.post("/api/addNew",(req,res)=> {
    const {title, content} = req.body;
    const keeperObj = new Keeper({
        title: title,
        content:content
    }); 
    keeperObj.save();
    res.redirect("/api/getAll");
})

app.post("/api/delete",(req,res)=> {
    const {title} = req.body;
    Keeper.deleteOne({title:title}).then(function(){
        res.redirect("/api/getAll");
    })
})

app.listen(process.env.PORT || 5000, ()=> {
    console.log("backend created at port 5000");
})
