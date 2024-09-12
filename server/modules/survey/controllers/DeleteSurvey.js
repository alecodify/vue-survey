import mongoose from "mongoose";

const DeleteSurvey = async (req, res) => {
    const surveyModel = mongoose.model('survey');
    
    try {
        const survey = await surveyModel.findByIdAndDelete({_id: req.params.id});
        
        if (!survey) {
          return res.status(404).json({status: 'Failed', message: 'Survey Not Found' });
        }
    
        res.status(200).json({status: 'Success', message: 'Survey Deleted Successfully' });
    } catch (error) {
        res.status(400).json({status: 'Failed', message: 'Error deleting survey', error });
    }
}

export default DeleteSurvey;