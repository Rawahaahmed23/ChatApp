
import express from 'express';
import 'dotenv/config';
import connectDb from './libs/connectdb.js';
import dns from 'dns'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import fs from 'fs'
import path from 'path';
import ClerkWebhook from'./webhooks/Clerk.webhook.js'

dns.setServers(["1.1.1.1","8.8.8.8"])
const PORT =process.env.PORT ;
const frontend_url = process.env.frontend_url


const publicDir = path.join(process.cwd(),'public')


if(fs.existsSync(publicDir)){
    app.use(express.static(publicDir))
    app.get("/{*any}",(req,res,next)=>{
        res.sendFile(path.join(publicDir,'index.html'),(err)=>next(err))
    })
}

const app = express();
app.use('/api/webhooks',express.raw({type:'application/json'}),ClerkWebhook)
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.use(cors({origin:frontend_url, credentials:true}))


connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}).catch((error) => {
    console.log('Database connection failed:', error);
});
