const express = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorize } = require('../middleware/auth');

const categoryRouter = express.Router();


categoryRouter.post("/", categoryController.createCategory);
categoryRouter.put("/", categoryController.updateCategory);
categoryRouter.get("/", categoryController.getCategories);
categoryRouter.delete("/", categoryController.deleteCategory);

module.exports = categoryRouter;



// router.get('/public', (req, res) => {
//   res.json({ message: 'This is public data' });
// });

// // Protected route (any authenticated user)
// router.get('/protected', authenticate, (req, res) => {
//   res.json({ 
//     message: 'This is protected data',
//     user: req.user 
//   });
// });

// // Admin only route
// router.get('/admin', authenticate, authorize('ADMIN'), (req, res) => {
//   res.json({ 
//     message: 'This is admin data',
//     user: req.user 
//   });
// });

// // Admin or Moderator route
// router.get('/moderator', authenticate, authorize('ADMIN', 'MODERATOR'), (req, res) => {
//   res.json({ 
//     message: 'This is moderator data',
//     user: req.user 
//   });
// });

