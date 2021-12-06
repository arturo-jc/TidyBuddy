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
const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const errorHandler = require("./errorHandler")
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');

// ROUTES
const activityTypeRoutes = require("./routes/activity-types");
const activityRoutes = require("./routes/activities");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users")
const householdRoutes = require("./routes/households")

// DB CONNECTION

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/TidyBuddy'
mongoose.connect(dbUrl)
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

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {secret}
})

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))

// PASSPORT SET UP

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
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
app.use(mongoSanitize());
app.use(helmet());

// CONTENT SECURITY POLICY

const scriptSrcUrls = [
    "https://kit.fontawesome.com",
];
const styleSrcUrls = [
    "https://fonts.googleapis.com",
    "https://kit-free.fontawesome.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://ka-f.fontawesome.com/"];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://ka-f.fontawesome.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// LOCALS

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.errorMoreInfo = req.flash("error-more-info")
    res.locals.currentUser = req.user;
    next();
})

// ROUTING

app.use("/", userRoutes);
app.use("/households", householdRoutes);
app.use("/households/:householdId/activitytypes", activityTypeRoutes);
app.use("/households/:householdId/activities", activityRoutes);
app.use("/households/:householdId/activities/:activityId/comments", commentRoutes);

// ERROR HANDLING

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use(errorHandler)

// LISTEN

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`LISTENING ON ${port}`))