import mongoose from "mongoose";
import { uploadToCloudinary } from '../../../middleware/imageUpload.js';

const CreateSurvey = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { title, expireDate, isActive, questions } = req.body;
    const image = null;
    const surveyModel = mongoose.model('survey');

    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            image = result.secure_url;
        }

        const newSurvey = await surveyModel.create({
            title,
            image,
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