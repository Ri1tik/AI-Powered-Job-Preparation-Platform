const mongoose = require("mongoose")


const dbConnection = ()=>{
   return mongoose.connect(process.env.MONGO_URL)
}

module.exports = dbConnection