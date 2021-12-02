class ExpressError extends Error {
    constructor(message, statusCode, name = null, moreInfo = null) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.moreInfo = moreInfo;
        if (name){
            this.name = name;
        }
    }
}

module.exports = ExpressError;