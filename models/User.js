import mongoose from 'mongoose';

const Userchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
  });

const User = mongoose.model('User', Userchema);

export default User;

