const postService = require('./../services/postService');
const commentService = require('./../services/commentService');
const {
	validateCreatePostInput,
	validateUpdatePostInput,
} = require('./../validation/post');

const all = async (req, res) => {
	try {
		const posts = await postService.all(req.user?.role || '');

		return res.json({
			success: true,
			data: {
				posts,
			},
		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const create = async (req, res) => {
	const { errors, isValid } = validateCreatePostInput(req.body);

	if (!isValid) {
		return res.status(422).json({
			success: false,
			errors,
		});
	}

	try {
		const { post } = await postService.create(req.user.id, req.body);

		return res.json({
			success: true,
			data: {
				post,
			},
		});
	} catch (e) {
		if (e.message === 'Category not found!') {
			return res.status(404).json({
				success: false,
				errors: {
					msg: e.message,
				},
			});
		}
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const update = async (req, res) => {
	const { errors, isValid } = validateUpdatePostInput(req.body);

	if (!isValid) {
		return res.status(422).json({
			success: false,
			errors,
		});
	}

	if(!(await postService.checkIfUserIsAuth(req.user,req.params.id))){
			return res.status(401).json({
				success: false,
				errors: {
					msg : "Unauthorizate!"
				},
			});
	}

	try {
		const { post } = await postService.update(req.params.id, req.body);

		return res.json({
			success: true,
			data: {
				post,
			},
		});
	} catch (e) {
		if (e.message === 'Category not found!') {
			return res.status(404).json({
				success: false,
				errors: {
					msg: e.message,
				},
			});
		}

		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const comment = async (req, res) => {
	try {
		const { post } = await postService.comment({
			id: req.user.id, 
			slug: req.params.slug, 
			...req.body
		});

		return res.json({
			success: true,
			data: {
				post,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 


const replyComment = async (req, res) => {
	try {
		const  replyComment  = await commentService.replyComment(
			req.user.id, 
			req.params.parentCommentId,
			req.body.comment
		);
		

		return res.json({
			success: true,
			replyComment,
			
		});
	} catch (e) {
		if(e.message === "Parent comment not found!"){
			return res.status(404).json({
				success:false,
				errors:{
					msg:'Comment to reply to was not found!'
				}
			})
		}
		console.log(e)
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 


const updateComment = async (req, res) => {
	const { errors, isValid } = validateUpdateCommentInput(req.body);

	if (!isValid) {
		return res.status(422).json({
			success: false,
			errors,
		});
	}

	if(!(await postService.checkIfUserIsAuth(req.user,req.params.id))){
			return res.status(401).json({
				success: false,
				errors: {
					msg : "Unauthorizate!"
				},
			});
	}

	try {
		const { comment } = await commentService.update(req.params.id, req.body);

		return res.json({
			success: true,
			data: {
				comment,
			},
		});
	} catch (e) {
		if (e.message === 'Comment not found!') {
			return res.status(404).json({
				success: false,
				errors: {
					msg: e.message,
				},
			});
		}

		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const deleteComment = async (req, res) => {

	if (!(await commentService.checkIfUserIsAuth(req.user, req.params.id))) {
		return res.status(401).json({
			success: false,
			errors: {
				msg: 'Unauthorizate!',
			},
		});
	}

	try {
		const { comment } = await commentService.deleteComment(req.params.id);

		return res.json({
			success: true,
			data: {
				msg: "Comment deleted successfully!",
				comment,
			},
		});
	} catch (e) {
		if (e.message === 'Comment not found!') {
			return res.status(404).json({
				success: false,
				errors: {
					msg: e.message,
				},
			});
		}

		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
};


const like = async (req, res) => {
	if(await postService.isNotAllowed(req.user,req.params.slug)){
			return res.status(400).json({
				success: false,
				errors: {
					msg : "You are not allowed!"
				},
			});
	}

	try {
		const { post } = await postService.like(req.user.id, req.params.slug);

		return res.json({
			success: true,
			data: {
				post,
			},
		});
	} catch (e) {
		console.log(e)
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const favorite = async (req, res) => {
	if (await postService.isNotAllowed(req.user, req.params.slug)) {
		return res.status(400).json({
			success: false,
			errors: {
				msg: 'You are not allowed!',
			},
		});
	}

	try {
		const { post } = await postService.favorite(req.user.id, req.params.slug);

		return res.json({
			success: true,
			data: {
				post,
			},
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

const deletePost = async (req, res) => {

	if (!(await postService.checkIfUserIsAuth(req.user, req.params.id))) {
		return res.status(401).json({
			success: false,
			errors: {
				msg: 'Unauthorizate!',
			},
		});
	}

	try {
		const { post } = await postService.deletePost(req.params.id);

		return res.json({
			success: true,
			data: {
				msg: "Deleted successfully!",
				post,
			},
		});
	} catch (e) {
		if (e.message === 'Post not found!') {
			return res.status(404).json({
				success: false,
				errors: {
					msg: e.message,
				},
			});
		}

		return res.status(500).json({
			success: false,
			errors: {
				msg: 'Something went wrong!',
			},
		});
	}
}; 

module.exports = {
	all,
	create,
	like,
	favorite,
	update,
	deletePost,
	comment,
	replyComment,
	updateComment,
	deleteComment
};
