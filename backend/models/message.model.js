import mongoose, { mongo } from "mongoose";


const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    }, 
    reciverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    text:{
        type:string
    },
    image:{
        type:string
    } ,
    video:{
        type:string
    }



},{timestamps:true})



const message = mongoose.model("message",messageSchema)

export default message