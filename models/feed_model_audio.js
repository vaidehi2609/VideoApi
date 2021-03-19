const mongoose = require('mongoose')

//to initialise a schema
const Schema = mongoose.Schema

//creating customized schema for our database
const AudioSchema = new Schema({
    audioUrl: {
        type: String,
        required: true
    },
    caption:{
        type:String,
        required: true
    },
   
    
})

const AudioModel = mongoose.model('Audio', AudioSchema)
module.exports = AudioModel