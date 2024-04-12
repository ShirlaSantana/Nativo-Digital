import { prisma } from "../database.js";

export const getPatients = async(req,res) => {
    try {
        const patients = await prisma.patient.findMany({
            include:{
                hospital:true
            }
        });
        if(!patients.length) return res.status(404).json({"message": "Not found"})
        res.json(patients)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}

export const createPatient = async(req, res) => {
    try {
        const {
            name,
            last_name,
            second_surname,
            sex,
            birthDate,
            cityOfOrigin,
            enrollmentDate,
            guardianFullName,
            guardianPhone,
            IDHospital
        } = req.body;
        const patient = await prisma.patient.create({
            data:{
                name,
                last_name,
                second_surname,
                sex,
                birthDate,
                cityOfOrigin,
                enrollmentDate,
                guardianFullName,
                guardianPhone,
                IDHospital
            }
        })
        res.json(patient)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}

export const updatePatient = async(req, res) => {
    try {
        const {
            name,
            last_name,
            second_surname,
            sex,
            birthDate,
            cityOfOrigin,
            enrollmentDate,
            guardianFullName,
            guardianPhone,
            IDHospital
        } = req.body;
        const { id } = req.params
        
        const patientUpdate = await prisma.patient.update({
            where:{
                id: Number(id)
            },
            data:{
                name,
                last_name,
                second_surname,
                sex,
                birthDate,
                cityOfOrigin,
                enrollmentDate,
                guardianFullName,
                guardianPhone,
                IDHospital
            }
        })
        res.json(patientUpdate)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}

export const deletePatient = async(req, res) => {
    try {
        const { id } = req.params
        const patientDelete = await prisma.patient.delete({
            where:{
                id: Number(id)
            },
        })
        res.json(patientDelete)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}
