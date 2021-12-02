module.exports.getModel = castErr => {
    const msgArray = castErr.message.split(" ");
    return msgArray[msgArray.length - 1].replaceAll('"', "").toLowerCase();
}

module.exports.getReason = validationErr => {
    const msgArray = validationErr.message.split(": ");
    return msgArray[msgArray.length - 1]
}

module.exports.returnTo = req => {
    if (req.method === "POST"){
        const urlArr = req.originalUrl.split("/")
        console.log(`urlArr: ${urlArr}`)
        const resource = urlArr[urlArr.length - 1]
        console.log(`Resource: ${resource}`)
        switch (resource){
            case "households":
                return "/households/find-or-create";
            case "activitytypes":
            case "comments":
                return urlArr.slice(0,3).join("/")
        }
    } 
    return req.originalUrl
}

// Cases to handle
// If they post to:
// /households/:householdId/activitytypes
// /households/:householdId/activities/:activityId/comments
// Default