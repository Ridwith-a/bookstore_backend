// import mongoose

const mongoose = require('mongoose')

const connectionstring = process.env.DATABASE  //accessing the environment variable

// connection
mongoose.connect(connectionstring).then(()=>{ //connect method return a promise
    console.log('mongodb connected successfully');
    
}).catch((err)=>{
    console.log(`mongodb connection failed due to :${err}`); // negative response
    
})