const Comment = require('./../models/Comment');

const create = async (data) => {
	return await new Comment({
		user: data.userId,
		post: data.postId,
		comment: data.comment,
	}).save();
};

const getCommentsPerPost = async (postId) => {
	return await Comment.find({
		post: postId,
		parentComment: null,	
	}).select({comment : 1, parentComment: 1});
}

const update = async (id, data) => {
	const comment = await Comment.findById(id);
	if (!comment) {
		throw new Error('Comment Not found!');
	}
	const updatedComment = await Comment.updateOne(
		{_id: comment.id},
		{
			$set: {
				comment: data.comment,
			},
		},
		{ new: true }
	);

	return {
		comment: updatedComment,
	};
};

const deleteComment = async (id) => {
	const comment = await Comment.findById(id);
	const hasChilds = await Comment.find({parentComment:id});
	if (!comment) {
		throw new Error('Comment Not found');
	}
	if(!!hasChilds){
		await Comment.deleteMany({parentComment:id});
	}
	await Comment.deleteOne({ _id: id });
	return {
		comment,
	};
};

const replyComment = async(userId, parentId,comment)=>{
	const parentComment = await Comment.findById({_id: parentId});

	if(!parentComment){
		throw new Error('Parent comment not found!');
	}

	return await new Comment({
		post: parentComment.post,
		user: userId,
		parentComment: parentComment.id,
		comment: comment,
	}).save();
}

const checkIfUserIsAuth = async (user, id) => {
	return (
		user.role == 'admin' ||
		(await Comment.findOne({
			id,
			user: user.id,
		}))
	);
};

module.exports = {
	create,
	getCommentsPerPost,
	update,
	deleteComment,
	checkIfUserIsAuth,
	replyComment
};
