import mongoose from "mongoose";

const CreateSurvey = async (req, res) => {
    const { title, description, expireDate, isActive, questions, image } = req.body;
    const surveyModel = mongoose.model('survey');

    try {

        const newSurvey = await surveyModel.create({
            title,
            description,
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