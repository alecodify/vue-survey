import mongoose from "mongoose";
import { uploadToCloudinary } from "../../../middleware/upload.js";

const UpdateSurvey = async (req, res) => {
    const {title, expireDate, isActive, questions, description } = req.body;
    const surveyModel = mongoose.model('survey');

    let updatedFields = { title, expireDate, isActive, description };

    try {

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            const imageUrl = uploadResult.secure_url;
            updatedFields.image = imageUrl;
        }

        if (questions) {
            updatedFields.questions = JSON.parse(questions);
        }

        const updatedSurvey = await surveyModel.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!updatedSurvey) {
            return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }

        res.status(200).json({status: 'Success', message: 'Survey Updated Successfully',  data: updatedSurvey});        
        
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error updating survey', error });
    }

}

export default UpdateSurvey;