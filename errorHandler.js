const {getModel, getReason, returnTo } = require("./utilities/mongooseErrors");

module.exports = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something went wrong.";

    const returnUrl = returnTo(req) || "/login"
    switch (err.name){
        case "CastError":

            // FLASH/REDIRECT IF ID WAS SENT AS QUERY STRING
            // OTHERWISE RENDER ERROR TEMPLATE

            const queryHouseholdId = req.query.householdId;
            if (queryHouseholdId){
                err.message = `There is no household with ID "${queryHouseholdId}". Please try again.`;
                req.flash("error", err.message)
                return res.redirect("/households/find-or-create")
            }

            const model = getModel(err)
            err.statusCode = 404;
            err.message = `Sorry, there is no ${model} with ID "${err.value}"`
            return res.status(err.statusCode).render("error", { err})

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
            return res.status(err.statusCode).render("error", {err})
        case "AuthenticationError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/login")
        case "IneligibilityError":
            req.flash("error", err.message)
            req.flash("error-more-info", err.moreInfo)
            return res.redirect("/households/find-or-create")
    }
    res.status(err.statusCode).render("error", { err})
}