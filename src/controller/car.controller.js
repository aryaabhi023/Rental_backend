import Car from "../models/Car.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiError,ApiResponse,asyncHandler} from "are_package";

export const uploadCar = asyncHandler(async (req, res) => {
    const {
        model,
        rating,
        carName,
        price,
        speed,
        type,
        seats,
        description
    } = req.body;

    if (
        [model,rating,carName,price,speed,type,seats,description].some(
          (field) => field?.trim() === "" || field === undefined
        )
      ) {
        throw new ApiError(400, "All fields are required");
      }

      const img=req.file?.path;
      if(!img){
        throw new ApiError(400,"Image is required");
      }
      let imgUrl = await uploadOnCloudinary(img);
      
      if(!(imgUrl?.url)){
        throw new ApiError(400,"Image upload failed");
      }

      imgUrl = imgUrl.url;

    const car = new Car({
        model,
        rating,
        carName,
        price,
        speed,
        type,
        seats,
        description,
        imgUrl
    });
    car.save();

    return res.status(201).json(new ApiResponse(201,car,"Car created successfully"));

});

export const getAllCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({});
  return res.status(200).json(new ApiResponse(200,cars,"List of all the cars"));
});

export const getCars = asyncHandler(async (req, res) => {
  const { pageToLoad = 1, searchTerm = "" } = req.body;
  const limit = 4;
  const page =pageToLoad;

  
  const searchCriteria = {
    $or: [
      { carName: { $regex: searchTerm, $options: "i" } },
      { model: { $regex: searchTerm, $options: "i" } },
    ],
  };

  const totalCars = await Car.countDocuments(searchCriteria);
  
  const cars = await Car.find(searchCriteria)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPages = Math.ceil(totalCars / limit);
  return res.status(200).json(new ApiResponse(200,{cars,totalPages},"List of all the cars"));
});


export const getCar = asyncHandler(async (req, res) => {
    const {id} = req.body;
    if(!id){
        throw new ApiError(400,"Car id is required");
    }
    const car=await Car.findById(id);
    return res.status(200).json(new ApiResponse(200,car,"Car details"));
});

export const deleteCar = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const deletedCar = await Car.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200,deletedCar,"Car deleted successfully"));
});

