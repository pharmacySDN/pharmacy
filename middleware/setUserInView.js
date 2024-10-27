// src/middleware/setUserInView.js
exports.setUserInView = (req, res, next) => {
    const username = req.cookies.username;
    const role = req.cookies.role;
    res.locals.username = username; // Make the username available in the view
    res.locals.role = role; // Make the role available in the view
    next();
};
