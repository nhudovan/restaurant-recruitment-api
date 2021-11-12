import ErrorResponse from'../utils/ErrorResponse';
import notify from './../configs/notify';

const errorHandler = (err, req, res, next) => {
    console.log(err.name.yellow);
    let error = {...err}

    if(error.name === "CastError"){
        let message = notify.ERROR_CASTERROR;
        error = new ErrorResponse(404,message);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        message : error.message || "SEVER ERROR"
    })
}

module.exports = errorHandler;;