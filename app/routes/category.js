const router = require('express').Router();

const categoryController = require("../controllers/categoryController");
const isAdmin = require('../middlewares/isAdmin');
// const isAuthenticated = require('./../middlewares/auth'); 

router.get('/', categoryController.all);
router.post('/create', isAdmin, categoryController.create);
router.put('/:id/edit', isAdmin, categoryController.update);
router.delete(
	'/:id/delete',
	isAdmin,
	categoryController.deleteCategory
);

module.exports = router;
