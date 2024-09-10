import mongoose from "mongoose";

const GetUsers = async (req, res) => {
    const userModel = mongoose.model('user');

    if (!req.user.isAdmin) {
        return res.status(403).json({status: 'Failed', message: 'Access denied. Admins only.' });
    }

    try {
        const users = await userModel.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error fetching users', error });
    }
}

export default GetUsers;