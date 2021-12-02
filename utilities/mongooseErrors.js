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
        const resource = urlArr[urlArr.length - 1]
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