const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload')
const FeedModel = require('../models/feed_model')
const fs = require("fs");
const sizeOf = require('get-video-dimensions')

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
      const start = parseInt(parts[0], 10)
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      if(start >= fileSize) {
        res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
        return
      }
      
      const chunksize = (end-start)+1
      // create video read stream for this particular chunk
      const file = fs.createReadStream(path, {start, end})
      //create headers
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
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
router.post('/upload',upload.any('video'), async(req,res,next)=>{
    const file = req.files[0].path
    console.log(file)

    if (!file) {
        error = new Error('no Images')
        error.status = 400
        return next(error)
    }
    const dimensions =sizeOf(file)
    const aspectRatio = dimensions.width/dimensions.height
    try {
        const video = new FeedModel({
            videoUrl: `http://localhost:3000/VideoApi/video/?path=${file}`,
            caption: req.body.caption,
            aspectRatio: aspectRatio

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
    FeedModel.find({}, (error, videos) => {

        if (error) {
            res.send("something went wrong");
            next(error);
        }

        //Sending list of videos in JSON format
        res.json({ videos })
    })

})
module.exports = router