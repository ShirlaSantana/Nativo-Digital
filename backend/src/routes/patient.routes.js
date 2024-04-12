import { Router } from "express";
import { getPatients, createPatient, updatePatient, deletePatient } from "../controllers/patient.controller.js";

const router = Router()

router.get('/patients', getPatients)

router.post('/patients', createPatient)

router.put('/patients/:id', updatePatient)

router.delete('/patients/:id', deletePatient)

export default router;