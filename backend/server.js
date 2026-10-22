
import express from 'express';
import 'dotenv/config';
import connectDb from './libs/connectdb.js';
import dns from 'dns'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

dns.setServers(["1.1.1.1","8.8.8.8"])
const PORT =process.env.PORT ;
const frontend_url = process.env.frontend_url

const app = express();
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
