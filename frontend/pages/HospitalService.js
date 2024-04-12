import axios from 'axios';

const getHospitals = async() => {
    try{
        const respone = await axios.get(`http://localhost:3000/api/hospitals`)
        return (respone.data)
    } catch (error) {
        console.log('Error', error)
        throw error;
    }
}


export {getHospitals};