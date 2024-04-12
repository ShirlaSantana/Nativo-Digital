import axios from 'axios';

const getPatients = async() => {
    try {
        const response = await axios.get(`http://localhost:3000/api/patients`);
        return (response.data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const createPatient = async(patientData) =>{
    try {
        const response = await axios.post(`http://localhost:3000/api/patients`, patientData);
        return (response.data)
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const updatePatient = async(id, updateData) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/patients/${id}`, updateData);
        return (response.data)
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const deleteRecord = async(id) => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/patients/${id}`);
        return (response.data)
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export {getPatients, createPatient, updatePatient, deleteRecord};