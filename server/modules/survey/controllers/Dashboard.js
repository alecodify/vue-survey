import mongoose from "mongoose";

const Dashboard = async(req, res) => {
    const surveyModel = mongoose.model('survey');

    try {
        const totalSurveys = await surveyModel.countDocuments();
        const latestSurvey = await surveyModel.findOne().sort({ createAt: -1 });

        const totalAnswers = await surveyModel.aggregate([
            { $unwind: "$responses" },
            { $unwind: "$responses.answers" },
            { $group: { _id: null, totalAnswers: { $sum: 1}} },
        ])
        
        res.status(200).json({status: 'Success', totalSurveys, latestSurvey, totalAnswers: totalAnswers.length ? totalAnswers[0].totalAnswers : 0});
    } catch (error) {
        res.status(500).json({status: 'Failed', message: 'Failed to fetch dashboard data' });
    }
} 

export default Dashboard;