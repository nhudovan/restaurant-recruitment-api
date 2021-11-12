import asyncHandler  from "./async";
import jwt 			     from 'jsonwebtoken';
import systemConfig  from "../configs/system";
import ErrorResponse from "../utils/ErrorResponse";
import UserServices  from "../services/userServices";

const protect = asyncHandler (async (req,res,next) => {
    let token = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.token){
      token = req.cookies.token
    }
    // console.log(token)
    if(!token) return next(new ErrorResponse(401,'Vui lòng đăng nhập tài khoản'));

    try {
        // decode token
        const decoded = jwt.verify(token,systemConfig.JWT_SECRET);
        // console.log(token)
        // console.log(systemConfig.JWT_SECRET)
        // console.log(decoded)
        req.user = await UserServices.listItems({id : decoded.id} , {task : 'one'});
        // console.log(req.user)
        next();
    } catch (err) {
        return next(new ErrorResponse(401,'Vui lòng đăng nhập tài khoản'));
    }
  
})

const authorize = (...roles) => {
    return (req,res,next) => {
      if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(403,'Bạn không có quyền truy cập'));
      }
      next();
    }
}





module.exports = { authorize,protect};