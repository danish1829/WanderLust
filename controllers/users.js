const User = require("../models/user.js");

module.exports.renderSignUpForm =  (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "User registered successfully!");
            res.redirect("/listings");
        });

    } catch (e) {
        console.error(e);  // Log the error to console for better debugging
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to wanderLust!");
    console.log("Logged in user:", req.user);  // Debugging: log the current user after login
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}