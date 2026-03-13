const Restaurant = require('../models/restaurant.schema');

const registerRestaurant = async (req, res) => {
    const { name, address, type, phone } = req.body;
    const owner = req.userData?.userId;

    if (!owner) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }

    if (!name || !address || !type || !phone) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    console.log('Registering restaurant:', { name, address, type, phone, owner });

    try {
        const existingRestaurant = await Restaurant.findOne({ name, owner });
        if (existingRestaurant) {
            return res.status(403).json({
                success: false,
                message: 'Restaurant already exists',
            });
        }

        const newRestaurant = new Restaurant({ name, address, type, phone, owner });
        const savedRestaurant = await newRestaurant.save();
        console.log('Restaurant saved:', savedRestaurant);
        return res.status(201).json({
            success: true,
            message: 'Restaurant registered successfully',
            data: savedRestaurant,
        });
    } catch (error) {
        console.error('Error registering restaurant:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { registerRestaurant };
