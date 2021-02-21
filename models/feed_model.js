const mongoose = require('mongoose')

//to initialise a schema
const Schema = mongoose.Schema

//creating customized schema for our database
const FeedSchema = new Schema({
    videoUrl: {
        type: String,
        required: true
    },
    caption:{
        type:String,
        required: true
    },
    aspectRatio:{
        type: Number,
        required: true

    }
    
})

const FeedModel = mongoose.model('Feed', FeedSchema)
module.exports = FeedModel