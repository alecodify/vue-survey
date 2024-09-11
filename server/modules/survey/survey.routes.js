import express from "express";
import { imageUpload } from "../../middleware/imageUpload.js";
import CreateSurvey from "./controllers/CreateSurvey.js";
import verifyUser from '../../middleware/verifyUser.js'
import verifyAdmin from '../../middleware/verifyAdmin.js'
import Response from "./controllers/Response.js";
import GetSurveys from "./controllers/GetSurveys.js";
import GetSurveyById from "./controllers/GetSurvey.js";
import UpdateSurvey from "./controllers/UpdateSurvey.js";
import CheckResult from "./controllers/CheckResult.js";
import DeleteSurvey from "./controllers/DeleteSurvey.js";
import Dashboard from "./controllers/Dashboard.js";

const surveyRoutes = express.Router();

surveyRoutes.post('/create', verifyUser, verifyAdmin, imageUpload.single('image'), CreateSurvey);
surveyRoutes.post('/:id', verifyUser, Response);
surveyRoutes.put('/:id', verifyUser, verifyAdmin, imageUpload.single('image'), UpdateSurvey)

surveyRoutes.get('/dashboard', Dashboard);
surveyRoutes.get('/', GetSurveys);
surveyRoutes.get('/:id', verifyUser, GetSurveyById);
surveyRoutes.get('/result/:id', verifyUser, verifyAdmin, CheckResult);

surveyRoutes.delete('/:id', verifyUser, verifyAdmin, DeleteSurvey);

export default surveyRoutes; 