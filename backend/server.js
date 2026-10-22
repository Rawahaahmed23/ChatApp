
import express from 'express';
import 'dotenv/config';
import connectDb from './libs/connectdb.js';
import dns from 'dns'

dns.setServers(["1.1.1.1","8.8.8.8"])

const app = express();
const PORT = 3000;

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at ${PORT}`);
    });
}).catch((error) => {
    console.log('Database connection failed:', error);
});
