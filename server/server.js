import express from 'express';
import cors from "cors";
import mongoose from 'mongoose'
import Task from '../models/Task.js';

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

mongoose.connect('mongodb://localhost:27017/test_db');

app.post('/list', async (req, res) => {
    console.log("POST METHOD")
    console.log(req.body)
    const newTask = new Task({
        "name": req.body.name,
        "status": req.body.status
    })
    await newTask.save();
    res.send('Task added successfully');
})

app.get('/list', async (req, res) => {
    try {
        // Fetch all records from the collection
        const records = await Task.find({}).exec();
    
        // Return the fetched records as JSON response
        res.json(records);
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

app.delete('/list/:id', async (req, res) => {
    await Task.findByIdAndDelete({
      id: mongoose.ObjectId(req.params.id)
    })

    res.json({
      message: 'Deleted successfully'
    })
})

app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));