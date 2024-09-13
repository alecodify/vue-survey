import mongoose from "mongoose";

const Response = async (req, res) => {
    const { responses } = req.body;
    const surveyModel = mongoose.model('survey');

    try {
        const survey = await surveyModel.findById({_id: req.params.id});

        if (!survey) {
            return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }

        const existingResponse = survey.responses.find(response => response.user.toString() === req.user.id.toString());

        if (existingResponse) {
            return res.status(409).json({ status: 'AlreadySubmitted', message: 'You have already submitted a response for this survey.' });
        }

        let response = {
            user: req.user.id,
            survey: req.params.id,
            answers: responses
        };

        survey.responses.push(response);

        await survey.save();

        res.status(201).json({status: 'Success', message: 'Response Submitted Successfully' });
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error submitting response', error });
    }
}

export default Response;