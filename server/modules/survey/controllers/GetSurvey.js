import mongoose from "mongoose";

const GetSurveyById = async(req, res) => {
    const surveyModel = mongoose.model('survey');

    try {
        const survey = await surveyModel.findById(req.params.id);
        
        if (!survey) {
           return res.status(401).json({status: 'Failed', message: 'Not Survey Found'});
        }

        res.status(200).json(survey);
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error fetching surveys', error });
    }
}

export default GetSurveyById;