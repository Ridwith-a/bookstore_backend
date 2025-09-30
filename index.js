// import dotenv module
require('dotenv').config()//to load environment

// import express 
const express = require('express')
// import cors
const cors = require('cors')
// import routes
const routes = require('./routes')
// import connection files
require('./connection')


// create server
const bookstoreServer = express()
// use cors to connect with friends
bookstoreServer.use(cors())
// parse the json data
bookstoreServer.use(express.json())
// server
bookstoreServer.use(routes)

bookstoreServer.use('/imgUpload',express.static('./ImgUploads'))
bookstoreServer.use('/pdfUpload',express.static('./pdfUploads'))

// port
const PORT = 4000 || process.env.PORT


// listen to the port to accept request 
bookstoreServer.listen(PORT,()=>{
    console.log(`server running successfully at port number ${PORT}`);
    
})