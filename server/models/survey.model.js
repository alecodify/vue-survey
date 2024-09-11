import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        enum: ['text', 'checkbox', 'radio', 'select', 'textarea'],
        required: true,
    },

    options: [{}],

});

const responseSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }, 

    answers: [
        { type: mongoose.Schema.Types.Mixed }
    ], 
});

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    expireDate: {
        type: Date,
        require: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    questions: [questionSchema],

    responses: [responseSchema],

}, {timestamps: true});

const surveyModel = mongoose.model("survey", surveySchema);

export default surveyModel;