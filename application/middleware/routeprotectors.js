const errorPrint = require ("../helpers/debug/debugprinters").errorPrint;
const successPrint = require("../helpers/debug/debugprinters").successPrint;
const routeProtectors = {};

routeProtectors.userIsLoggedIn = function(req, res, next){
    if(req.session.username){
        successPrint("User is logged in");
        next();
    } else {
        errorPrint("User is not logged in");
        req.flash('error', 'You must be logged in to create a Post!');
        res.redirect('/login');
    }
}

module.exports = routeProtectors;