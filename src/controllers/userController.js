
import asyncHandler            from     '../middleware/async';
import userServices 	       from     '../services/userServices';
import ErrorResponse           from     '../utils/ErrorResponse';
import userValidates	       from     '../validates/users';


const getAllUsers = asyncHandler( async (req,res, next) => {

        const data = await userServices.listItems(req.query , {'task' : 'all'})
        res.status(200).json({
            success : true,
            count : data.length,
            data : data
        })
})

const getSingleUser = asyncHandler(async (req,res, next) => {
        const data = await userServices.listItems({'id' : req.params.id} , {'task' : 'one'})
        res.status(200).json({
            success : true,
            data : data
        })
})

const postUser = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await userServices.create(req.body);
        res.status(201).json({
            success : true,
            data : data
        })
    }
})

const putUser = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await userServices.editItem({'id' : req.params.id,'body' : req.body} , {'task' : 'edit'})
        res.status(200).json({
            success : true,
            data : data
        })
    }
})

const deleteUser = asyncHandler(async (req,res, next) => {
        const data = await userServices.deleteItem({'id' : req.params.id} , {'task' : 'one'})
        res.status(200).json({
            success : true,
            data : data
        })
})



const validateReq = async (req,res,next) => {
    let err = await userValidates.validator(req);
    if(Object.keys(err).length > 0){
        next(new ErrorResponse(400,err));
        return true;
    }
    return false;
}


module.exports = {
    getAllUsers,
    getSingleUser,
    postUser,
    putUser,
    deleteUser,
};