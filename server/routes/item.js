import { Router } from 'express';
import {
    createItem,
    deleteitem,
    getItem,
    getItems,
    getItemsByUserId,
    getOneItemUser,
    updateitem,
} from '../services/item.js';
import { upload } from '../config/multer.js';
import checkAuth from '../auth/firebase_auth.js';
const router = Router();

router.get('/getItem/:id', getItem);
router.get('/getItems', getItems);
router.get('/getItem/:user/:id', getOneItemUser);
router.get('/getItemsUser', checkAuth, getItemsByUserId);
router.delete('/deleteitem/:id', deleteitem);
router.put('/updateitem/:id', updateitem);
router.post('/upload', checkAuth, upload.array('files'), createItem);
router.post('/saveImage', (req, res) => {
    upload(req, res, callBackHandling(createItem));
});

export default router;
