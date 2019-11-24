const mongoose = require('mongoose');
const followerSchema = new mongoose.Schema({
    followers:[],
    id:Number,
    deleteFollowers:[]
});

const Followers = new mongoose.model('Followers',followerSchema);


module.exports = Followers;