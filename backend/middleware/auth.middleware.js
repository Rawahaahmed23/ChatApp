import { getAuth } from "@clerk/express";
import User from "../models/user.mode.js";



export  async function protectRoute(req,res,next){
     try{
        const {userid} = getAuth(req)

        if(!userid){
            res.status(400).json({message:"Unauthroized"})
            return
        }
        const user = await User.findOne({clerkId:userId})
        if(!user){
            res.status(404).json({message:'user doesnt exsist'})
            return
        }
        req.user= user
        next()

     }catch(error){
        console.log(error);
        res.status(500).json({message:"internal server errror"})
        
     }
}