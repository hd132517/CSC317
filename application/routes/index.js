var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const { getPostById, getCommentsByPostId, getRecentPosts } = require('../middleware/postsmiddleware');


/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { webpage:"Home", header1:true});
});
router.get('/searchresults', getRecentPosts, function(req, res, next) {
  res.render('index', { webpage:"Search Results", header1:true});
});

router.get('/login', (req, res, next) =>{
  res.render('login', { webpage:"SF State Global Login Form", header2:true });
})

router.get('/registration', (req, res, next) =>{
  res.render('registration', { webpage:"SF State Global Registration Form", header2:true });
})

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req, res, next) =>{
  res.render('postimage', { webpage:"Post Image Form", header1:true });
})

router.get('/post/:id(\\d+)', getPostById, getCommentsByPostId, (req, res, next) => {
  res.render('viewpost', { webpage: `Post ${req.params.id}`, header1:true });
});

module.exports = router;
