const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
const db = require('./src/models/sequelize_init')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//syncing model to db
db.sequelize.sync()
//home
app.get('/', (req, res) => {
    res.send('Hello')
})

//listen to the port
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}..`)
})