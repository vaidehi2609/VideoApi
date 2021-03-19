const express = require('express')
const router = express.Router()
const uploadVideo = require('../middleware/upload_video')
const VideoModel = require('../models/feed_model_video')
const fs = require("fs");
const uploadAudio = require('../middleware/upload_audio')
const AudioModel = require('../models/feed_model_audio')
const sizeOf = require('get-video-dimensions')

//VIDEO

//for streaming videos
router.get("/video", function (req, res) {

  // get video stats
  const path = req.query.path;
  const fileSize = fs.statSync(req.query.path).size;

  // Ensure there is a range given for the video
  const range = req.headers.range;

  //Parse range
  //example: "bytes=3234-"
  if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      //start of the chunk
      const start = parseInt(parts[0], 10)
      //end of the chunk
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1

      // if the starting chunk requested is greater than the whole
      if(start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
        return
      }
      
      const chunksize = (end-start)+1
      //create headers
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }

      // create video read stream for this particular chunk
      const file = fs.createReadStream(path, {start, end})

      // HTTP Status 206 for Partial Content
      res.writeHead(206, head)
      
      // Stream the video chunk to the client
      file.pipe(res)
    } else {
      
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      
      fs.createReadStream(path).pipe(res)
    }
});


//for uploading videos
router.post('/uploadVideo',uploadVideo.any('video'), async(req,res,next)=>{
    const file = req.files[0].path
    console.log(file)

    if (!file) {
        error = new Error('no Videos')
        error.status = 400
        return next(error)
    }
    
    try {
        const video = new VideoModel({
            videoUrl: `http://172.20.10.3:3000/Api/video/?path=${file}`,
            caption: req.body.caption,
            

        })
        const savedVideo = await video.save()

        //Returning the link to new saved video
        res.json(savedVideo)

    } catch (error) {
        //Resolving error
        next(error)
    }
} )

//for retrieving all the videos
router.get('/videoList', async(req,res)=>{
    VideoModel.find({}, (error, videos) => {

        if (error) {
            res.send("something went wrong");
            next(error);
        }

        //Sending list of videos in JSON format
        res.json({ videos })
    })

})

//AUDIO

//for streaming audio
router.get("/audio", function (req, res) {

  // get audio stats
  const path = req.query.path;
  const fileSize = fs.statSync(req.query.path).size;

  // Ensure there is a range given for the audio
  const range = req.headers.range;

  //Parse range
  //example: "bytes=3234-"
  if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      //start of the chunk
      const start = parseInt(parts[0], 10)
      //end of the chunk
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      if(start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
        return
      }
      
      const chunksize = (end-start)+1
      // create audio read stream for this particular chunk
      const file = fs.createReadStream(path, {start, end})
      //create headers
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mp3',
      }
      // HTTP Status 206 for Partial Content
      res.writeHead(206, head)
      console.log('hii')
      // Stream the audio chunk to the client
      file.pipe(res)
    } else {
      console.log('hi')
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mp3',
      }
      res.writeHead(200, head)
      
      fs.createReadStream(path).pipe(res)
    }
});

//for uploading audios
router.post('/uploadAudio',uploadAudio.any('audio'), async(req,res,next)=>{
  const file = req.files[0].path
  console.log(file)

  if (!file) {
      error = new Error('no audios')
      error.status = 400
      return next(error)
  }
  
  try {
      const audio = new AudioModel({
          audioUrl: `http://localhost:3000/Api/audio/?path=${file}`,
          caption: req.body.caption,
          

      })
      const savedAudio = await audio.save()

      //Returning the link to new saved audio
      res.json(savedAudio)

  } catch (error) {
      //Resolving error
      next(error)
  }
} )

module.exports = router