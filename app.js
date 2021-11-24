// REQUIREMENTS

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("./models/user")

// ROUTES
const activityTypeRoutes = require("./routes/activity-types");
const activityRoutes = require("./routes/activities");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users")

// MODELS
const { ActivityType } = require("./models/activity-type");
const { Activity } = require("./models/activity");

// DB CONNECTION

mongoose.connect('mongodb://localhost:27017/tidyApp')
    .then(() => {
        console.log("CONNECTED TO MONGODB")
    })
    .catch(err => {
        console.log("COULD NOT CONNECT TO MONGODB")
        console.log(err)
    })

// APP SET UP

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// SESSION

const sessionConfig = {
    name: "session",
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        // maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// PASSPORT SET UP

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL MIDDLEWARE

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})


// ROUTING

app.get("/", async (req, res) => {
    const activityTypes = await ActivityType.find({}).populate("completedBy")
    const activities = await Activity.find({}).populate("comments")
    res.render("dashboard", { activityTypes, activities })
})

app.use("/", userRoutes)
app.use("/activitytypes", activityTypeRoutes)
app.use("/activities", activityRoutes)
app.use("/activities/:activityId/comments", commentRoutes)

const port = 3000
app.listen(port, () => console.log(`LISTENING ON ${port}`))