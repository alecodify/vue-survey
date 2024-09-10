import mongoose from "mongoose";

const CheckResult = async (req, res) => {
    const surveyModel = mongoose.model('survey');

    if (!req.user.isAdmin) {
        return res.status(403).json({status: 'Failed', message: 'Access denied. Admins only.' });
    }

    try {
        const survey = await surveyModel.findById(req.params.id).populate('responses.user', 'username email');
      
        if (!survey) {
          return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }
    
        res.status(200).json({ surveyResults: survey.responses });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching survey results', error });
    }
}

export default CheckResult;