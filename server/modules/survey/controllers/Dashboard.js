import mongoose from "mongoose";

const Dashboard = async(req, res) => {
    const surveyModel = mongoose.model('survey');

    try {
        const totalSurveys = await surveyModel.countDocuments();
        const latestSurvey = await surveyModel.findOne().sort({ createdAt: -1 });

        const totalAnswers = await surveyModel.aggregate([
            { $unwind: "$responses" },
            { $unwind: "$responses.answers" },
            { $group: { _id: null, totalAnswers: { $sum: 1}} },
        ])

        const surveyActivities = await surveyModel.aggregate([
            { $project: { title: 1, createdAt: 1, expireDate: 1, responses: 1 } },
            { $unwind: { path: "$responses", preserveNullAndEmptyArrays: true } }, 
            { $sort: { "responses.end_date": -1, createdAt: -1 } }, 
            { $limit: 5 } 
        ]);
        
        res.status(200).json({status: 'Success', totalSurveys, latestSurvey, surveyActivities, totalAnswers: totalAnswers.length ? totalAnswers[0].totalAnswers : 0});
    } catch (error) {
        res.status(500).json({status: 'Failed', message: 'Failed to fetch dashboard data' });
    }
} 

export default Dashboard;