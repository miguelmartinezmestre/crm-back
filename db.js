const mongoose = require("mongoose")
require("dotenv").config();

const conectarDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{

        });
        console.log("db conectada")
    }catch (e){
        console.log("error")
        process.exit(1);
    }
}

module.exports = conectarDb;
