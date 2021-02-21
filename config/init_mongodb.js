const mongoose = require('mongoose')

//to connect to the mongodb databse
mongoose.connect(process.env.MONGODB_URL,
    {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => {
        console.log('mongodb connected')
    })
    .catch(err => console.log(err.message))

//when connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
})

//when encountered with an error
mongoose.connection.on('error', (err) => {
    console.log(err.message)
})


//when disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected to db')
})

//for closing the databse ,fires when the server is stopped 
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)

})