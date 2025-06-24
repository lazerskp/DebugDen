const mongoose = require("mongoose")
require("dotenv").config()

exports. dbConnect = async()=>{

    const uri = process.env.DB_URL
    try {
        const conn = await mongoose.connect(uri)
        console.log(`db connect on ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}
