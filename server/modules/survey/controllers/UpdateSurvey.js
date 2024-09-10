import mongoose from "mongoose";
import { uploadToCloudinary } from "../../../middleware/imageUpload.js";

const UpdateSurvey = async (req, res) => {
    const {title, expireDate, isActive, questions} = req.body;
    const surveyModel = mongoose.model('survey');

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    let updatedFields = { title, expireDate, isActive };

    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            updatedFields.image = result.secure_url;
        }

        if (questions) {
            updatedFields.questions = JSON.parse(questions);
        }

        const updatedSurvey = await surveyModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedSurvey) {
            return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }

        res.status(200).json(updatedSurvey);        
        
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error updating survey', error });
    }

}

export default UpdateSurvey;