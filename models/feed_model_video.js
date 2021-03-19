const mongoose = require('mongoose')

//to initialise a schema
const Schema = mongoose.Schema

//creating customized schema for our database
const VideoSchema = new Schema({
    videoUrl: {
        type: String,
        required: true
    },
    caption:{
        type:String,
        required: true
    },
   
    
})

const VideoModel = mongoose.model('videos', VideoSchema)
module.exports = VideoModel