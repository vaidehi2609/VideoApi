const express = require('express')
const app = express()


const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
require('./config/init_mongodb')
const FileRoute = require('./routes/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploadVideo', express.static(__dirname + '/uploadVideo'))
app.use('/uploadAudio',express.static(__dirname + '/uploadAudio'))

//home
app.get('/', (req, res) => {
   res.send('hello')
})

app.use('/Api',FileRoute)

//listen to the port
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}..`)
})