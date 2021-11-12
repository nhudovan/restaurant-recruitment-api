
import asyncHandler            from     '../middleware/async';
import authServices 	       from     '../services/authServices';
import ErrorResponse           from     '../utils/ErrorResponse';
import password	               from     '../validates/password';
import systemConfig            from     '../configs/system';




const register = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const token = await authServices.create(req.body);
        if(token){
            saveCookieResponse(res,201,token);
        }
    }
    console.log('hi')
})

const login = asyncHandler(async (req,res, next) => {
    const token = await authServices.login(req.body,res);
    if(token){
        saveCookieResponse(res,201,token);
    }
})

const userProfile = asyncHandler(async (req,res, next) => {
    res.status(200).json({
        success : true,
        user : req.user
    })
})

const forgotPassword = asyncHandler(async (req,res, next) => {
    const result = await authServices.ForgotPassword(req.body)
    if(!result) res.status(401).json({success : true , massage : "Email không tồn tại"})
    res.status(200).json({
        success : true,
        data : result
    })
})

const resetAuth = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const user = await authServices.resetPassword({resetToken : req.params.resetToken , password : req.body.password})
        if(!user) res.status(401).json({success : true , massage : "Không tồn tại Token"})
        res.status(201).json({success : true,user})
    }
    
})

const logout = asyncHandler(async (req,res, next) => {
    res.status(200)
    .cookie('token','none',{
        expirers : new Date (
            Date.now() + 10 * 1000
        ),
        httpOnly : true
    })
    .json({
        success : true,
    })
})



const validateReq = async (req,res,next) => {
    let err = await password.validator(req);
    if(Object.keys(err).length > 0){
        next(new ErrorResponse(400,err));
        return true;
    }
    return false;
}

const saveCookieResponse = (res,statusCode,token) => {
    const options = {
        expirers : new Date (
            Date.now() + systemConfig.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
    }

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success : true,
        token
    })
}


module.exports = {
    register,
    login,
    logout,
    userProfile,
    forgotPassword,
    resetAuth,
};
