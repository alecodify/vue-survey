import mongoose from "mongoose";

const GetSurveys = async(req, res) => {
    const surveyModel = mongoose.model('survey');

    try {
        const surveys = await surveyModel.find();
        
        if (!surveys) {
           return res.status(401).json({status: 'Failed', message: 'Not Survey Found'});
        }

        res.status(200).json(surveys);
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error fetching surveys', error });
    }
}

export default GetSurveys;