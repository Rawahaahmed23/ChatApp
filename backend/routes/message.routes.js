import express from 'express'

import { protectRoute } from '../middleware/auth.middleware.js';
import { 
 getUserForSlidebar,
 getConversationSidebar,
 getMessages,
 SendMessage
} from '../controller/messageController.js';
import { upload } from '../middleware/upload,middleware.js';

const routes = express.Router()


routes.use(protectRoute)
routes.get('/users', getUserForSlidebar)
routes.get('/conversations', getConversationSidebar)
routes.get('/:id', getMessages)
routes.post('/send/:id',upload.single("media"), SendMessage)
export default routes;
