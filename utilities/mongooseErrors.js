module.exports.getModel = castErr => {
    const msgArray = castErr.message.split(" ");
    return msgArray[msgArray.length - 1].replaceAll('"', "").toLowerCase();
}

module.exports.getReason = validationErr => {
    const msgArray = validationErr.message.split(": ");
    return msgArray[msgArray.length - 1]
}

/* For many kinds of errors, user should be redirected to "req.originalUrl".
However, some POST and DELETE routes do not have a corresponding GET route.
In such cases, redirecting user to "req.originalUrl" will throw a 404.
Instead, user should be redirected to whichever page they made the request from.
The following function is to figure out the routes in question
*/

module.exports.returnTo = req => {
    const urlArr = req.originalUrl.split("/")
    if ( req.method === "POST" ){
        const resource = urlArr[urlArr.length - 1]
        switch (resource){

            /* If user makes POST request to "/households",
            redirect to "/households/find-or-create" if there is an error
            */
            case "households":
                return "/households/find-or-create";

            /*if user makes POST request to either
            "/household/:householdId/activityTypes"
            or "/household/:householdId/activityTypes",
            redirect to "/household/:householdId" if there is an error
            */
            case "activitytypes":
            case "comments":
                return urlArr.slice(0,3).join("/")
        }
    }

    /*
    If user makes DELETE request to "users/:userId",
    redirect to "users/:userId/delete-account" if there is an error
    */
    if ( req.method === "DELETE" && urlArr[1] === "users" ){
        const userId = urlArr[2].split("?")[0]
        return `/users${urlArr[0]}/${userId}/delete-account`
    } 
    return req.originalUrl
}