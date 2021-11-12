
import asyncHandler            from     '../middleware/async';
import restaurantServices 	   from     '../services/restaurantServices';
import ErrorResponse           from     '../utils/ErrorResponse';
import restaurantValidates	   from     '../validates/restaurants';


const getAllRestaurants = asyncHandler( async (req,res, next) => {

        const data = await restaurantServices.listItems(req.query , {'task' : 'all'})
        res.status(200).json({
            success : true,
            count : data.length,
            data : data
        })
});


const getSingleRestaurant = asyncHandler(async (req,res, next) => {
        const data = await restaurantServices.listItems({'id' : req.params.id} , {'task' : 'one'})
        res.status(200).json({
            success : true,
            data : data
        })
});


const postRestaurant = asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await restaurantServices.create(req.body);
        console.log(data);
        res.status(201).json({
            success : true,
            data : data
        })
    }
    
})


const putRestaurant =  asyncHandler(async (req,res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        const data = await restaurantServices.editItem({'id' : req.params.id,'body' : req.body} , {'task' : 'edit'})
        res.status(200).json({
            success : true,
            data : data
        })
    }
})


const deleteRestaurant =asyncHandler(async (req,res, next) => {
        const data = await restaurantServices.deleteItem({'id' : req.params.id} , {'task' : 'one'})
        res.status(200).json({
            success : true,
            data : data
        })
})


const validateReq = async (req,res,next) => {
    console.log(req)
    let err = await restaurantValidates.validator(req);
    if(Object.keys(err).length > 0){
        next(new ErrorResponse(400,err));
        return true;
    }
    return false;
}


module.exports = {
    getAllRestaurants,
    getSingleRestaurant,
    postRestaurant,
    putRestaurant,
    deleteRestaurant,
};


