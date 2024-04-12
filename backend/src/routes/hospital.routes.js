import { Router } from "express";
import { getHospitals, createHospital } from "../controllers/hospital.controller.js";

const router = Router()

router.get('/hospitals', getHospitals)

router.post('/hospitals', createHospital)

export default router;