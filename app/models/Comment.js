const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'users',
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'posts',
	},
	parentComment:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'comments',
		required:false,
	},
	comment: { type: String, required: true },
});

module.exports = mongoose.model('comments', CommentSchema);
