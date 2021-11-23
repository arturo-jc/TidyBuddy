// REQUIREMENTS

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

// ROUTES
const activityTypeRoutes = require("./routes/activity-types");
const activityRoutes = require("./routes/activities");
const commentRoutes = require("./routes/comments");

// MODELS
const { ActivityType } = require("./models/activity-type");
const { Activity } = require("./models/activity");

// DB CONNECTION

mongoose.connect('mongodb://localhost:27017/tidyApp')
    .then(() => {
        console.log("CONNECTED TO MONGODB")
    })
    .catch(err => {
        console.log("COULD NOT CONNECT TO MONGODB:")
        console.log(err)
    })

// APP SET UP

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTING

app.get("/", async (req, res) => {
    const activityTypes = await ActivityType.find({}).populate("completedBy")
    const activities = await Activity.find({}).populate("comments")
    res.render("dashboard", { activityTypes, activities })
})

app.use("/activitytypes", activityTypeRoutes)
app.use("/activities", activityRoutes)
app.use("/activities/:activityId/comments", commentRoutes)

const port = 3000
app.listen(port, () => console.log(`LISTENING ON ${port}`))