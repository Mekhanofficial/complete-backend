const express = require('express');
const itemschema = require('./item.schema');
const restaurantschema = require('../../../models/restaurant.schema');

const createitem = async (req, res) => {
    const { item_name, description, price, unit, restaurant } = req.body;
    const image = req.file.filename; // Access the uploaded file information
    console.log(item_name, description, price, unit, image);

        // const verifyrestaurant = await restaurantschema.findById(restaurant);
        console.log(req.userData.userId);
        const verifyrestaurant = await restaurantschema.findOne({ owner: req.userData.userId }); 
        
        // Check if the restaurant exists and is owned by the authenticated user
    
    try {        
        if (!verifyrestaurant) { // Changed condition - check if restaurant doesn't exist
            return res.status(403).json({
                success: false,
                message: 'Only registered restaurants can create items'
            });
        }

        if (!item_name || !description || !price || !unit ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }


        
        // Check if item already exists (optional but recommended)
        const existingItem = await itemschema.findOne({ item_name, restaurant });
        if (existingItem) {
            return res.status(403).json({
                success: false,
                message: 'Item already exists in this restaurant'
            });
        }


        const newItem = new itemschema({
            item_name,
            description,
            price,
            unit,
            restaurant: verifyrestaurant._id, // Associate the item with the restaurant's ID
            imageUrl: image, // Save the image filename in the database
        });

        await newItem.save();
        
        console.log(newItem);
        return res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: newItem
        });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const findOneItem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Item id is required'
        });
    }

    try {
        const item = await itemschema.findById(id).populate('restaurant');
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Item found',
            data: item
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid item id'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = {
    createitem,
    findOneItem
}; 
