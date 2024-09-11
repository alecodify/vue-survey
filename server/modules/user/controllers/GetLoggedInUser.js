import mongoose from "mongoose";

const GetLoggedInUser = async (req, res) => {
    const user_id = req.user;
    const userModel = mongoose.model('user');

    if (!user_id){
      return res.status(400).json({status: "Failed", message: "Login First"})
    }

    try {
      const user = await userModel.findById({_id: user_id.id}).select('-password');
     
      if (!user) {
        return res.status(404).json({status: 'Failed', message: 'User Not Found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({status: 'Failed', message: 'Error fetching user', error });
    }
};

export default GetLoggedInUser;