import mongoose from "mongoose";
import { uploadToCloudinary } from "../../../middleware/upload.js";

const CreateSurvey = async (req, res) => {
    const { title, description, expireDate, isActive, questions } = req.body;
    const surveyModel = mongoose.model('survey');

    try {
        let imageUrl;

        const uploadResult = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploadResult.secure_url;
        

        const newSurvey = await surveyModel.create({
            title,
            description,
            image: imageUrl,
            expireDate,
            isActive,
            questions: JSON.parse(questions),
        });

        res.status(201).json({status: 'Success', data: newSurvey });
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error creating survey', error });
    }
}

export default CreateSurvey;