import mongoose from "mongoose";

const GetLoggedInUser = async (req, res) => {
    const userModel = mongoose.model('user');

    try {
      const user = await userModel.findById(req.user._id).select('-password'); // Exclude password
     
      if (!user) {
        return res.status(404).json({status: 'Failed', message: 'User Not Found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({status: 'Failed', message: 'Error fetching user', error });
    }
};

export default GetLoggedInUser;