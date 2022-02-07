import {connect} from "mongoose"
require("dotenv").config();

export const conectarDb = async () =>{
    try{
        await connect(process.env.MONGO_URL,{

        });
        console.log("db conectada")
    }catch (e){
        console.log("error")
        process.exit(1);
    }
}

