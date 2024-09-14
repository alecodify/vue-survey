import mongoose from "mongoose";

const CheckResult = async (req, res) => {
    const surveyModel = mongoose.model('survey');
    const userModel = mongoose.model('user');

    try {
        const surveyId = req.params.id;

        const survey = await surveyModel.findById(surveyId).populate('responses.user');
        
        if (!survey) {
            return res.status(404).json({status: "Failed", message: "Survey not found" });
        }

        const adminUser = await userModel.findOne({ isAdmin: true });

        if (!adminUser) {
            return res.status(404).json({ status: "Failed", message: "Admin not found" });
        }

        const adminResponse = survey.responses.find(response => response.user._id.equals(adminUser._id));

        if (!adminResponse) {
            return res.status(400).json({status: "Failed", message: "Admin Response Not Found" });
        }

        const results = [];

        // Loop through each user's response
        survey.responses.forEach(response => {
            if (response.user._id.equals(adminUser._id)) {
                return;
            }

            const userAnswers = response.answers;
            let correctAnswers = 0;
            let wrongAnswers = 0;
            const totalQuestions = survey.questions.length;
            const matchResults = [];

            // Compare each question's answer
            survey.questions.forEach((question) => {
                const userAnswer = userAnswers.get(question._id.toString());
                const adminAnswer = adminResponse.answers.get(question._id.toString());

                const isMatch = JSON.stringify(userAnswer) === JSON.stringify(adminAnswer);

                if (isMatch) {
                    correctAnswers += 1; 
                } else {
                    wrongAnswers += 1; 
                }

                matchResults.push({
                    question: question.question,
                    userAnswer: userAnswer,
                    adminAnswer: adminAnswer,
                    isMatch: isMatch
                });
            });

            const scorePercentage = (correctAnswers / totalQuestions) * 100;

            results.push({
                user: response.user.username,
                email: response.user.email,
                correctAnswers: correctAnswers,
                wrongAnswers: wrongAnswers,
                totalQuestions: totalQuestions,
                percentage: scorePercentage.toFixed(2),
                matchResults: matchResults
            });
        });

        res.json({ surveyTitle: survey.title, totalResponses: survey.responses.length, Results: results });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export default CheckResult;