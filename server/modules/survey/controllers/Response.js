import mongoose from "mongoose";

const Response = async (req, res) => {
    const { responses } = req.body;
    const surveyModel = mongoose.model('survey');

    try {
        const survey = await surveyModel.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }

        surveyModel.responses.push({ user: req.user._id, answers: responses });
        await surveyModel.save();

        res.status(201).json({status: 'Success', message: 'Response Submitted Successfully' });
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error submitting response', error });
    }
}

export default Response;