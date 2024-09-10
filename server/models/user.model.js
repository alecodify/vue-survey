import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "User Fullname is Required"],
        unique: true
    },

    email: {
        type: String,
        required: [true, "User Email is Required"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "User Password is Required"],
    },

    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },

    isAdmin: {
        type: Boolean,
        default: false
    },
   
}, { timestamps: true });

const userModel = mongoose.model("user", usersSchema);

export default userModel;