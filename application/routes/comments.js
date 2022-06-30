const express = require('express');
const router = express.Router(); 
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const create = require('../models/Comments.js').create;

router.post('/create', (req, res, next) => {
    if(!req.session.username) {
        errorPrint('must be logged in to comment');
        req.json({
            code: -1,
            status: "danger",
            message: "Must be logged in to comment"
        });
    } else {
        let { comment, postId } = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
    
        create(userId, postId, comment)
        .then((wasSuccessful) => {
            if(wasSuccessful != -1) {
                successPrint(`comment was created for ${username}`);
                res.json({
                    code: 1,
                    status: "success",
                    message: "comment created",
                    comment: comment,
                    username: username
                });
            } else {
                errorPrint('comment was not saved');
                res.json({
                    code: -1,
                    status: "danger",
                    message: "comment was not created",
                });
            }
        })
        .catch((err) => next(err));
    }
});

module.exports = router;