import e, { Router } from "express";
import { createCode, getCodes, updateCode } from "../controller/code.controller.js";

const router=Router();

router.route('/getCodes').get(getCodes);
router.route('/updateCode').post(updateCode);

export {router};