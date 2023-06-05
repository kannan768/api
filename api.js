const express= require("express");
const app=express();
const mongoose= require("mongoose");
const {Schema}= mongoose;
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.options('*', cors());
mongoose.connect("mongodb://0.0.0.0:27017/mydb" , {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const sch= new Schema({
    Username:{
        required:true,
        type:String
    },
    Password:{
        required:true,
        type:String
    }},
 { versionKey: false})
const monmodel=mongoose.model("users", sch);

//get
app.get('/fetch', async (req, res) => {
    try{
        const data = await monmodel.find();
        res.json(data)
        res.send(`Listed Documents..`)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//post
app.post('/add', async (req, res) => {
    const data = new monmodel({
        Username: req.body.Username,
        Password: req.body.Password
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
        res.send(`Document has been posted..`)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get by ID Method
app.get('/getOne/:id', async (req, res) => {
    try{
        const data = await monmodel.findById(req.params.id);
        res.json(data)
        res.send(`getby id..`)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// GET BY USER NAME
app.get('/getbyname/:Username', async (req, res) => {
    try{
        const data = await monmodel.find({Username : req.params.Username});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/api/login', async(req, res) => {
  
const { Username, Password } = req.query;

const user = await monmodel.findOne({ Username });
   res.set({
  "Allow-access-Allow-Origin": '*'
    })
 if (user && user.Password === Password) {
   
res.json(true)
 } 
 else{
// 
  res.json(false)
 }
 });

   


//Update by ID Method
app.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        const result = await monmodel.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send(result)
        res.send(`Document has been updated..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }})

//Delete by ID Method
app.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await monmodel.findByIdAndDelete(id)
        res.send(`Document has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//listen
app.listen(3000, () =>{
        console.log('Server running on port ')
})