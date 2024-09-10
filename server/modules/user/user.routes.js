import express from "express";
import verifyUser from "../../middleware/verifyUser.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";
import GetUsers from "./controllers/GetUsers.js";
import GetLoggedInUser from "./controllers/GetLoggedInUser.js";

const userRoutes = express.Router();

userRoutes.get('/', verifyUser, verifyAdmin, GetUsers);
userRoutes.get('/loggedIn', verifyUser, GetLoggedInUser);

export default userRoutes;