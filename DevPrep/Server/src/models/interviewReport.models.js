import mongoose from "mongoose";
const interviewReportSchema = mongoose.Schema({
	jobDescription: {
		type: String,
		required: true,
	},
	resume: {
		type: String,
	},
	selfDescription: {
		type: String,
	},
	matchScore: {
		type: Number,
		min: 0,
		max: 100,
		required: true,
	},
	technicalQuestion: [
		{
			question: {
				type: String,
				required: true,
			},
			intention: {
				type: String,
				required: true,
			},
			answer: {
				type: String,
				required: true,
			},
		},
	],
	behavioralQuestion: [
		{
			question: {
				type: String,
				required: true,
			},
			intention: {
				type: String,
				required: true,
			},
			answer: {
				type: String,
				required: true,
			},
		},
	],
	skillGaps: [
		{
			skills: {
				type: String,
				required: true,
			},
			severity: {
				type: String,
				enum: ["low", "medium", "high"],
				required: true,
			},
		},
	],
	preprationPlan: [
		{
			day: {
				type: String,
				required: true,
			},
			time: {
				type: String,
				required: true,
			},
			task: [
				{
					type: String,
					required: true,
				},
			],
		},
	],
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	title:{
		type:String
	}
},{timestamps:true});
const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema);
export default interviewReportModel;