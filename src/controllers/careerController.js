
import asyncHandler            from     '../middleware/async';
import careerServices 	       from     '../services/careerServices';
import ErrorResponse           from     '../utils/ErrorResponse';
import careerValidates	       from     '../validates/careers';



const getAllCareers = asyncHandler ( async (req,res, next) => {

        const data = await careerServices.listItems(req.query , {'task' : 'all'})
        if(!data) return res.status(200).json({success : true,data : "Dữ liệu rỗng"})
        res.status(200).json({
            success : true,
            count : data.length,
            data : data,
        })
        
})

const getSingleCareer = asyncHandler(async (req,res, next) => {
        const data = await careerServices.listItems({'id' : req.params.id} , {'task' : 'one'})
        if(!data) return res.status(200).json({success : true,data : "Dữ liệu rỗng"})
        res.status(200).json({
            success : true,
            data : data
        }) 
})

const postCareer = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await careerServices.create(req.body);
        res.status(201).json({
            success : true,
            data : data
        })
    }
})

const putCareer =asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await careerServices.editItem({'id' : req.params.id,'body' : req.body} , {'task' : 'edit'})
        res.status(200).json({
            success : true,
            data : data
        })
    }
})


const putCareerEvent = asyncHandler(async (req,res, next) => {
    const data   = await careerServices.event({'id' : req.params.id,'type' : req.params.type})
    if(!data) return res.status(200).json({success : true,data : "Sai trạng thái cập nhật"})
    res.status(200).json({
        success : true,
        data : data
    })
})


const deleteCareer = asyncHandler(async (req,res, next) => {
        const data = await careerServices.deleteItem({'id' : req.params.id} , {'task' : 'one'})
        res.status(200).json({
            success : true,
            data : data
        })
})



const validateReq = async (req,res,next) => {
    let err = await careerValidates.validator(req);
    if(Object.keys(err).length > 0){
        next(new ErrorResponse(400,err));
        return true;
    }
    return false;
}

module.exports = {
    getAllCareers,
    getSingleCareer,
    postCareer,
    putCareer,
    deleteCareer,
    putCareerEvent,
};