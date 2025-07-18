class ExpressError extends Error {
    constructor(status,message){
        super(message);
        this.statusCode = status;
        // this.name = "ExpressError";
    }
}

module.exports = ExpressError;