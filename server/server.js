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
        res.json(records.map(record => ({
          id: record._id,
          name: record.name,
          status: record.status
        })));
      } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

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