import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    name: {
        type: String
    },
    status: {
        type: String
    },
  });

const Task = mongoose.model('Task', TaskSchema);

export default Task;

