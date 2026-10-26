import express from 'express'
import User from '../models/user.mode.js'
import {verifyWebhook}from "@clerk/backend/webhooks"



const router =express.Router()


router.post('/',async(req,res)=>{
    try{

        const singinSecret = process.env.CLERK_WEBHOOKS_SINGING_SECRET_KEY
        if(!singinSecret){
            res.status(400).json({message: "Webhook secret is not define"})
            return
        }
        // Clerk's verifier expects a Web Request with the raw body; express.raw gives a Buffer.
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);
    
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });
    const evt = await verifyWebhook(request,{singinSecret})
    if(evt.type === "user.created"|evt.type ==="user.updated"){
        const u = evt.data
        const email =u.email_address?.find((e)=> e.id===u.primary_email_address_id)?.email_address ??u.email_address?.[0]?.email_address
        const full_Name = [u.first_name,u.last_name].filter(Boolean).join("")||u.username||email?.split("@")[0] 
        await User.findOneAndUpdate(
            {clerkId:u.id},
            {clerkId: u.id ,email,full_Name ,profilePic:u.image_url},
            {new:true,upsert:true,setDefaultsOnInsert:true}
    
        )
    }
        
    if(evt.type ==="user.deleted"){
        if(evt.data.id) await User.findOneAndDelete({clerkId:evt.data.id})
    }
    res.status(200).json({recived:true})
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"webhook failed"})
        
    }
})

export default router