const {getModel, getReason, returnTo } = require("./utilities/mongooseErrors");

module.exports = (err, req, res, next) => {
    const { statusCode = 500 } = err;
    const returnUrl = returnTo(req) || "/login"
    switch (err.name){
        case "CastError":
            const queryHouseholdId = req.query.householdId;
            if (queryHouseholdId){
                err.message = `There is no household with ID "${queryHouseholdId}". Please try again.`;
                req.flash("error", err.message)
                return res.redirect("/households/find-or-create")
            }
            const model = getModel(err)
            err.message = `Sorry, there is no ${model} with ID "${err.value}"`
            return res.status(statusCode).render("error", { err, statusCode: 404 })
        case "ValidationError":
            req.flash("error", getReason(err))
            return res.redirect(returnUrl)
        case "MissingUsernameError":
        case "MissingPasswordError":
        case "IncorrectPasswordError":
            req.flash("error", err.message)
            return res.redirect(returnUrl)
        case "HouseholdNotFoundErrorFlash":
            req.flash("error", err.message)
            return res.redirect("/households/find-or-create")
        case "HouseholdNotFoundErrorRender":
            return res.status(statusCode).render("error", {err, statusCode})
        case "AuthenticationError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/login")
        case "IneligibilityError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/households/find-or-create")
    }
    if (!err.message) err.message = "Something went wrong."
    res.status(statusCode).render("error", { err, statusCode })
}