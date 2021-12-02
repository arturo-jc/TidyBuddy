// REQUIREMENTS

if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const {getModel, getReason, returnTo } = require("./utilities/mongooseErrors");

// ROUTES
const activityTypeRoutes = require("./routes/activity-types");
const activityRoutes = require("./routes/activities");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users")
const householdRoutes = require("./routes/households")

// MODELS
const { User } = require("./models/user");
const { Household } = require("./models/household");

// DB CONNECTION

mongoose.connect('mongodb://localhost:27017/tidyApp')
    .then(() => {
        console.log("CONNECTED TO MONGODB")
    })
    .catch(err => {
        console.log("COULD NOT CONNECT TO MONGODB")
        console.log(err)
    })

// INSTANTIATIONS

const app = express();

// SESSION CONFIG

const sessionConfig = {
    name: "session",
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// PASSPORT SET UP

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// APP SET UP

app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// GLOBAL MIDDLEWARE

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.errorMoreInfo = req.flash("error-more-info")
    res.locals.currentUser = req.user;
    next();
})

// ROUTING

app.get("/index", async (req, res) => {
    const households = await Household.find({}).populate("users")
    const users = await User.find({})
    res.render("index", { users, households });
})

app.use("/", userRoutes);
app.use("/households", householdRoutes);
app.use("/households/:householdId/activitytypes", activityTypeRoutes);
app.use("/households/:householdId/activities", activityRoutes);
app.use("/households/:householdId/activities/:activityId/comments", commentRoutes);

// ERROR HANDLING

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    const returnUrl = returnTo(req) || "/register"
    switch (err.name){
        case "CastError":
            const model = getModel(err)
            err.message = `Sorry, no ${model} matches that ID`;
            return res.status(statusCode).render("error", { err })
        case "ValidationError":
            req.flash("error", getReason(err))
            return res.redirect(returnUrl)
        case "MissingUsernameError":
        case "MissingPasswordError":
            req.flash("error", err.message)
            return res.redirect(returnUrl)
    }
    if (!err.message) err.message = "Something went wrong."
    res.status(statusCode).render("error", { err })
})

// LISTEN

const port = 3000
app.listen(port, () => console.log(`LISTENING ON ${port}`))