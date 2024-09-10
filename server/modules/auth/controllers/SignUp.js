import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SignUp = async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  const userModel = mongoose.model("user");

  if (!username) throw "User Name is Required";
  if (!email) throw "User Email is Required";
  if (!password || password === "") throw "User Password is Required";

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    throw "User Already Exist, try to Login or use another account";
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
    isAdmin,
  });

  const { password: pass, ...rest } = newUser._doc;

  res.status(201).json({ status: "Success", message: "New User Registered Successfully", user: rest });
};

export default SignUp;
