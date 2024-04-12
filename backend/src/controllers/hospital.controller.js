import { prisma } from "../database.js";

export const getHospitals = async(req, res) =>{
    try {
        const hospitals = await prisma.hospital.findMany();
        res.json(hospitals)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}

export const createHospital = async(req, res) =>{
    try {
        const { name, zipCode } = req.body
        const hospital = await prisma.hospital.create({
            data:{
                name,
                zipCode
            }
        })
        res.json(hospital)
    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}