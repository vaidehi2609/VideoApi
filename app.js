const express = require('express')
const app = express()


const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
require('./config/init_mongodb')
const VideoRoute = require('./routes/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(__dirname + '/uploads'))

//home
app.get('/', (req, res) => {
   res.send('hello')
})

app.use('/VideoApi',VideoRoute)

//listen to the port
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}..`)
})