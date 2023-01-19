import Item from '../models/item.js';
import mongoose from 'mongoose';
import { uploadItemImage } from './blob.js';

export const getItems = async (req, res) => {
    const query = req.query;
    const { category, currentCursor, item_owner } = query;
    const payload = { published: true };

    if (category) {
        payload.item_category = category;
    }

    if (currentCursor) {
        payload._id = { $gt: currentCursor };
    }

    if (item_owner) {
        payload.item_owner = item_owner;
    }

    try {
        const items = await Item.find(payload).sort({ _id: 1 }).limit(20);
        res.status(200).json(items);
    } catch (error) {
        res.status(404).json({ message: error });
    }
};

export const getItem = async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.find({
            _id: mongoose.Types.ObjectId(id),
            published: true,
        });
        res.status(200).json(item);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

export const getOneItemUser = async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const item = await Item.findOne({
            userId: userId,
            _id: mongoose.Types.ObjectId(id),
        });
        res.status(200).json(item);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

export const createItem = async (req, res) => {
    const files = req.files;
    let imagesUrls = [];
    //block adding other users items
    if (files) {
        for (const file of files) {
            let buffer = file.buffer;
            try {
                let blobName = await uploadItemImage(buffer, file.originalname);
                imagesUrls.push(blobName);
            } catch (error) {
                console.log(error);
                return res.status(409).json({ message: error.message });
            }
        }
    }

    const item = req.body.item;
    const parsedItem = JSON.parse(item);
    parsedItem.images = imagesUrls;
    const newItem = new Item(parsedItem);
    try {
        await newItem.save();
        const userCollection = await helper_GetItemsByUserId(parsedItem.item_owner);
        res.status(201).json({ items: userCollection });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteitem = async (req, res) => {
    const _id = req.params.id;
    try {
        await Item.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Successfully deleted item: ' + id });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateitem = async (req, res) => {
    const id = req.params.id;
    const item = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, item);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getItemsByUserId = async (req, res) => {
    const userId = req.firebase_uid;
    try {
        //const items = await helper_GetItemsByUserId(userId)
        //this was creating error if not items
        const items = await Item.find({
            item_owner: userId,
            // maybe we need limit of items here!
        });
        console.log(items);
        res.status(200).json({ items: items });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const helper_GetItemsByUserId = async (userId) => {
    const items = await Item.find({
        item_owner: userId,
        // maybe we need limit of items here!
    });
    return helper_StandardizeItemCollection(items);
};

const helper_StandardizeItemCollection = (items) => {
    const standardItems = items.map((item) => {
        return helper_StandardizeItem(item);
    });
    return standardItems;
};

