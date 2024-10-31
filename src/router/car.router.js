import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { uploadCar,getCars,deleteCar,getCar,getAllCars } from "../controller/car.controller.js";

const router=Router();

router.get("/",(req,res)=>{
    res.send("car router");
});

router.route("/uploadCar").post(upload.single("image"),uploadCar);
router.route("/getAllCars").get(getAllCars);
router.route("/getCars").post(getCars);
router.route("/getCar").post(getCar);
router.route("/deleteCar/:id").delete(deleteCar);

export {router};

