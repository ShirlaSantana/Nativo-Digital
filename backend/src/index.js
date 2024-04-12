import express from 'express'
import morgan from 'morgan'
import cors from 'cors'; 
import routerPatient from './routes/patient.routes.js'
import routerHospital from './routes/hospital.routes.js'

const app = express();

app.set('PORT', 3000);

app.use(morgan('dev'))
app.use(express.json())

app.use(cors());

app.use('/api', routerPatient)
app.use('/api', routerHospital)

app.listen(app.get('PORT'), () => {
    console.log(`Server runnin on port`, app.get('PORT'))
})