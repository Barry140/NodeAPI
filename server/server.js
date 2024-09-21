import express from 'express';
import cors from "cors";
import mongoose from 'mongoose'
import Task from '../models/Task.js';
import User from '../models/User.js';
import bcrypt from "bcrypt";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

mongoose.connect('mongodb+srv://takiyogoha:9IojnswMUoqe6zQz@cluster0.hbcgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/list', async (req, res) => {
    console.log("POST METHOD")
    const newTask = new Task({
        "name": req.body.name,
        "status": req.body.status
    })
    await newTask.save();
    res.json('Task added successfully');
})

app.post('/users', async (req, res) => {
  const saltRounds = 5;
  let data = {
    ...req.body
  };
    
  const user = await User.findOne({ email: data.email });
  if(!user){
    const salt = bcrypt.genSaltSync(saltRounds);
    data.password = bcrypt.hashSync(data.password, salt);
    const newUser = new User(data)
    await  newUser.save();
    setTimeout(() => {
      res.json({
        message: 'success'
      })
    }, 4000)
  }else{
    res.json({
      message: 'created email'
    })
  }
  
})
app.get('/users', async (req, res) => {
  const records = await User.find();
  console.log("Get User data!")
  return res.json({
    message: 'Fetch user successfully',
    records: records.map(record => ({  //Map values
      id: record._id,
      firstname: record.firstname,
      lastname: record.lastname,
      email: record.email,
      password: record.password
    }))
  });
})

app.post('/login', async (req, res) => {
  const data = req.body;
  const user = await User.findOne({ email: data.email });
  bcrypt.compare(data.password, user.password, function(err, result) {
    if(result) {
      console.log("Login Successfully!")
      res.json({
        message: 'login success'
      })
    }else if(!result) res.json({
        message: 'Login Failed'
    })
});
})

app.get('/list', async (req, res) => {    
    try {
        let queryoptions = {}
        if(req.query.keyword)  //search by keyword
          {queryoptions = 
            {$or: 
              [ {"name": 
                  {"$regex": `${req.query.keyword}`,"$options": "i"}},
                {"status": 
                  {"$regex": `${req.query.keyword}`,"$options": "i"}}
              ]
            } 
           }
        console.log(queryoptions);
        // Fetch all records from the collection
        const records = await Task.find(queryoptions);
        // Return the fetched records as JSON response
        console.log("Get list data!")
        setTimeout(() => {
          res.json({
            message: 'Fetch list successfully',
            records: records.map(record => ({  //Map values
              id: record._id,
              name: record.name,
              status: record.status
            }))
          });
        }, 1000);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

app.put('/list/:id', async (req,res) => {
  try{
    const uid = req.params.id.toString();
    const objectId = new mongoose.Types.ObjectId(uid);
    const { name, status } = req.body;
    await Task.findOneAndUpdate({ _id: objectId }, {
      name, status
    });
    console.log("Item update successfully!")
    res.json("Item Updated!")
  }catch(err){
    console.log(err)
  }
})

app.get('/list/:id', async (req, res) => {
  try{
    const uid = req.params.id.toString();
    const objectId = new mongoose.Types.ObjectId(uid);
    const result = await Task.findOne({ _id: objectId });
    console.log("Get data by ID successfully!")
    if(result){
      res.json({
        name: result.name,
        status: result.status
      })
    }else{
      console.log("ID not found!")
      res.json({});
    }
  }catch(err){
    console.log(err)
  }
})

app.delete('/list/:id', async (req, res) => {
  try {
    const uid = req.params.id.toString();
    console.log(uid)
    // Validate if uid is a valid ObjectId
    if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ msg: 'Invalid or missing ID' });
    }
    // Convert uid to ObjectId
    const objectId = new mongoose.Types.ObjectId(uid);
    // Attempt to delete the document
    const result = await Task.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
       res.status(200).json({ msg: 'Document deleted successfully' });
    } else {
       res.status(404).json({ msg: 'No document found with the provided ID' });
    }
  } catch (err) {
    console.error('Error during deletion:', err); // Log the error details
    res.status(500).json({ msg: 'Internal Server Error: ' + err.message });
  }
})


app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));