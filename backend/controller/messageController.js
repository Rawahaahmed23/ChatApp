
import User from "../models/user.model.js"
import Message from'../models/message.model.js'
import { hasImagekitConfig, uploadChatMedia } from "../libs/imagekit.js"

export async function getUserForSlidebar(req,res)  {
    try{
        const loggedInUserId =req.user._id
        const filterUser=await User.find({_id:{$ne:loggedInUserId}}).select("clerkId")
        res.status(200).json(filterUser)

    }catch(erorr){
        res.status(500).json({messsage:'internal server error'})
        console.log(erorr);
        

    }
}


export async function getConversationSidebar(req,res) {
    try{
      const loggedInUserId = req.user._id
      const conversations =await Message.aggregate([
         {$match:{$or:[{senderId:loggedInUserId},{reciverId:loggedInUserId}]} },
          {
        $group: {
          // The partner is the other person on the message (not me).
          _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      
      { $sort: { lastMessageAt: -1 } },
    
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      
      { $project: { clerkId: 0 } }
         
      ])
    }catch(error){
       console.log('error in getConversationSlidebar',error);
       res.status(500).json({messsage:'internal server errror'})

       
    }
    
}


export async function getMessages(req,res) {
  try{
   const {id:userToChatid}  = req.params
   const myId = req.user._id

   const messages = User.find({
    $or:[
      {senderId:myId,reciverId:userToChatid},
      {senderId:userToChatid,reciverId:myId},
    ]
   }).sort({createdAt:1})
   res.status(200).json(messages)


  }catch(error){
    console.log('getMessages',error);
    res.status(500).json({message:'internal Server Errro'})
    
  }
}

export async function SendMessage(req,res) {
  try{
     const {text} = req.body
     const {id:reciverId}= req.params
     const senderId = req.user._id
     let imageUrl;
     let videoUrl;
     if(req.file){
       if(!hasImagekitConfig){
        return res.status(500).json({message:"Media upload is not configured"})
       }
       const url  = await uploadChatMedia(req.file)
       if(req.file.mimetype.startWith("video/"))videoUrl=url
       else imageUrl = url
      }

      const newMessage = new Message({
        senderId,
        reciverId,
        text,
        image:imageUrl,
        video:videoUrl,
      })

      await newMessage.save()
      res.status(201).json(newMessage)
  }catch(error){
    console.log(error);
    
  }
  
}