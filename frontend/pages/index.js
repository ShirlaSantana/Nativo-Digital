import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { createPatient, getPatients, updatePatient, deleteRecord } from './PatientService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';       
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import estados from '../public/demo/data/estados.json'
import { getHospitals } from './HospitalService';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { InputNumber } from 'primereact/inputnumber';

export default function Home() {

    let emptyPatient = [{
        name:'',
        sex:'',
        last_name:'',
        second_surname:'',
        birthDate:'',
        cityOfOrigin:'',
        enrollmentDate:'',
        guardianFullName:'',
        guardianPhone:'',
        hospital:{name:''},
        IDHospital:0
    }]
    
    const toast = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [patient, setPatient] = useState(emptyPatient)
    const [patients, setPatients] = useState(null)
    const [hospitals, setHospitals] = useState(null)
    const [selectedPatients, setSelectedPatients] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [enrollmentDate, setEnrollmentDate] = useState(null);
    const [birthDate, setBirthdate] = useState(null);
    const [patientDialog, setPatientDialog] = useState(false);
    const [deletePatientDialog, setDeletePatientDialog] = useState(false);
    const [deletePatientsDialog, setDeletePatientsDialog] = useState(false);
    const headers = ['Nombre completo','Sexo ', 'Fecha de nacimiento', 'Fecha de inscripción', 'Edad', 'Ciudad de origen', 'Hospital de origen', 'Nombre del tutor', 'Teléfono del tutor'];

    useEffect(() => {
        getPatients().then(patient => setPatients(patient))
        getHospitals().then(hospital => setHospitals(hospital))
    }, []);

    //Dialog handler
    const openNew = () => {
        setPatient(emptyPatient);
        setBirthdate(null)
        setEnrollmentDate(null)
        setSelectedHospital(null)
        setSubmitted(false);
        setPatientDialog(true);
    }
    const hideDialog = () => {
        setSubmitted(false);
        setPatientDialog(false);
        setBirthdate(null)
        setEnrollmentDate(null)
    }

    const hideDeletePatientDialog = () => {
        setDeletePatientDialog(false);
    }

    const hideDeletePatientsDialog = () => {
        setDeletePatientsDialog(false);
    }


    //CRUD handling
    const savePatient = () => {
        setSubmitted(true);
        if(patient.name?.trim()){
            if (patient.id) {
                console.log(patient.id)
                console.log('actualiza')
                
                const updatedPatients = patients.map(_patient => {
                    if (_patient.id === patient.id) {
                        return patient;
                    }else {
                        return _patient
                    }
                });
                setPatients(updatedPatients);
                updatePatient(patient.id, patient)
                .then(() => {
                    toast.current.show({ severity: 'success', summary: '¡Exito!', detail: 'La información se actualizó correctamente.', life: 3000 }); 
                })
                .catch(error => {
                    console.error('Error al actualizar la información:', error);
                }); 
            }
            else {
                createPatient(patient)
                .then(() => {
                    setPatients([...patients, patient])
                    toast.current.show({ severity: 'success', summary: '¡Exito!', detail: 'El paciente se registró correctamente', life: 3000 })
                })
                .catch(error => {
                    console.error('Error al crear el paciente:', error);
                });  
            } 
            setPatientDialog(false);
            setPatient(emptyPatient);
            setBirthdate(null)
            setEnrollmentDate(null)
            setSelectedHospital(null)
        }else{ return}
    }

    const editPatient = (patient) => {
        setPatient({...patient});
        setPatientDialog(true);
    }

    const confirmDeletePatient = (patient) => {
        setPatient(patient);
        setDeletePatientDialog(true);
    }

    const deletePatient = () => {
        let _patients = patients.filter(val => val.id !== patient.id);
        deleteRecord(patient.id)
        .then(() => {
            toast.current.show({ severity: 'success', summary: '¡Exito!', detail: 'El registro se eliminó correctamente', life: 3000 }); 
        })
        .catch(error => {
            console.error('Error al eliminar el registro:', error);
        }); 
        setPatients(_patients);
        setDeletePatientDialog(false);
        setPatient(emptyPatient);
    }

    const confirmDeleteSelected = () => {
        setDeletePatientsDialog(true);
    }

    const deleteSelectedPatients = async() => {
        let _patients = patients.filter(val => !selectedPatients.includes(val));
        let patientsId = patients.filter(val => selectedPatients.includes(val));
        let ids = []
        for(let _patient of patientsId){
            ids.push(_patient.id)
        }
        try {
            const promises = ids.map(id => deleteRecord(id));
            await Promise.all(promises);
            toast.current.show({ severity: 'success', summary: '¡Exito!', detail: 'Los registros se eliminaron correctamente', life: 3000 });
        } catch (error) {
            console.error('Error al eliminar los registros:', error);
        }
        setPatients(_patients);
        setDeletePatientsDialog(false);
        setSelectedPatients(null);
    }

    const exportPDF = () => {
        let data = [];
         patients.forEach(patient => {
        data.push({
            "Nombre completo": patient.name + " " + patient.last_name + " " + patient.second_surname,
            "Sexo": patient.sex == "M" ? "Masculino" : "Femenino",
            "Fecha de nacimiento": patient.birthDate.split("T")[0],
            "Fecha de inscripción": patient.enrollmentDate.split("T")[0],
            "Edad":calculateAge(patient.birthDate).toString(),
            "Ciudad de origen": patient.cityOfOrigin,
            "Hospital de origen": patient.hospital.name,
            "Nombre del tutor": patient.guardianFullName,
            "Teléfono del tutor": patient.guardianPhone,
            });
        });
        const arrayValor = data.map(objeto => Object.values(objeto));
        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
            head:[headers],
            body: arrayValor,
            startY: 10,
                     })
        doc.save("pacientes.pdf"); 
    }

    //Form input handling
    const onCategoryChange = (e) => {
        let _patient = {...patient, sex:e.value};
        setPatient(_patient);
    }

    const onCityChange = (e) => {
        const val = e
        let _patient = {...patient, cityOfOrigin:val};
        setPatient(_patient);
    }

    const onHospitalChange = (e) => {
        const val = e
        let _patient = {...patient, IDHospital:val.id,  hospital: val};
        setPatient(_patient);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _patient = {...patient};
        _patient[`${name}`] = String(val);
        setPatient(_patient);
    }

    const onDateChange = (e, name) => {
        const val = e.toISOString();
        let _patient = {...patient};
        _patient[`${name}`] = val
        setPatient(_patient);
    }

    //Table data handling
    const birthDateBodyTemplate = (rowData) => {
        return rowData?.birthDate.split("T")[0]
    }

    const enrollmentBodyTemplate = (rowData) => {
        return rowData?.enrollmentDate.split("T")[0]
    }

    const sexBodyTemplate = (rowData) => {
        if(rowData?.sex == "F")
        return "Femenino" 
        if(rowData?.sex == "M")
        return "Masculino"
    }

    const calculateAge = (date) => {
        const today = new Date();
        const birthday = new Date(date);
        const age = today.getFullYear() - birthday.getFullYear();
      
        if (today.getMonth() < birthday.getMonth() || 
            (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) {
          age--;
        }
        return age
    }

    const ageBodyTemplate = (rowData) => {
        const age = calculateAge(rowData?.birthDate)
        return age
    }

   
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editPatient(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeletePatient(rowData)} />
            </React.Fragment>
        );
    }

    
    const header = (
        <div className="flex flex-column md:flex-row md:align-items-center justify-content-between">
            <span className="w-full md:w-auto">
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." className="w-full lg:w-auto" />
            </span>
            <div className="mt-3 md:mt-0 flex justify-content-end">
                <Button icon="pi pi-plus" className="mr-2 p-button-rounded" onClick={openNew} tooltip="Nuevo registro" tooltipOptions={{position: 'bottom'}} />
                <Button icon="pi pi-trash" className="p-button-danger mr-2 p-button-rounded" onClick={confirmDeleteSelected} disabled={!selectedPatients || !selectedPatients.length} tooltip="Eliminar registro(s)" tooltipOptions={{position: 'bottom'}} />
                <Button icon="pi pi-upload" className="p-button-help p-button-rounded" onClick={exportPDF} tooltip="Exportar a PDF" tooltipOptions={{position: 'bottom'}} />
            </div>
        </div>
    );

    //Dialog Buttons
    const patientDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={savePatient} />
        </React.Fragment>
    );

    const deletePatientDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deletePatient} />
        </React.Fragment>
    );

    const deletePatientsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePatientsDialog} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPatients} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo surface-card p-4 border-round shadow-2">
            <Toast ref={toast} />

            <div className="text-3xl text-800 font-bold mb-4">Registro de pacientes</div>

            <DataTable value={patients} selection={selectedPatients} onSelectionChange={(e) => setSelectedPatients(e.value)}
                dataKey={patients?.id} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pacientes"
                globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
                <Column field="name" header="Nombre" sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="last_name" header="Primer apellido" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="second_surname" header="Segundo apellido" sortable style={{ minWidth: '12rem' }}></Column>
                <Column header="Edad" body={ageBodyTemplate} style={{ minWidth: '6rem' }}></Column>
                <Column field="sex" header="Sexo" body={sexBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                <Column field="birthDate" header="Fecha de nacimiento" body={birthDateBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="cityOfOrigin" header="Ciudad de origen"  sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="enrollmentDate" header="Fecha de inscripción" body={enrollmentBodyTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="hospital.name" header="Hospital" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="guardianFullName" header="Nombre del tutor" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="guardianPhone" header="Teléfono del tutor"  style={{ minWidth: '11rem' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            {/* Creation form */}
            <Dialog visible={patientDialog} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '40vw'}} header="Detalles del paciente" modal className="p-fluid" footer={patientDialogFooter} onHide={hideDialog}>
                <div className='flex gap-2'>
                    <div className="field">
                        <label htmlFor="name">Nombre</label>
                        <InputText id="name" value={patient.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.name })} />
                        {submitted && !patient.name && <small className="p-error">Campo requerido.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="last_name">Primer apellido</label>
                        <InputText id="last_name" value={patient.last_name} onChange={(e) => onInputChange(e, 'last_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.last_name })} />
                        {submitted && !patient.last_name && <small className="p-error">Campo requerido.</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="second_surname">Segundo apellido</label>
                        <InputText id="second_surname" value={patient.second_surname} onChange={(e) => onInputChange(e, 'second_surname')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.second_surname })} />
                        {submitted && !patient.second_surname && <small className="p-error">Campo requerido.</small>}
                    </div>
                </div>
                <div className="field">
                    <label className="mb-3">Sexo</label>
                    <div className="flex">
                        <div className="field-radiobutton col-3">
                            <RadioButton inputId="category1" name="sex" value="F" onChange={onCategoryChange} checked={patient.sex === 'F'} />
                            <label htmlFor="category1">Femenino</label>
                        </div>
                        <div className="field-radiobutton col-3">
                            <RadioButton inputId="category2" name="sex" value="M" onChange={onCategoryChange} checked={patient.sex === 'M'} />
                            <label htmlFor="category2">Masculino</label>
                        </div>
                    </div>
                    {submitted && !patient.sex && <small className="p-error">Selecciona una opci&oacute;n.</small>}
                </div>
                <div className='flex justify-content-between'>
                    <div className='field'>
                        <label className="mb-3">Ciudad de origen</label>
                        <div className="card flex">
                        <Dropdown value={patient.cityOfOrigin} onChange={(e) => onCityChange(e.value, 'cityOfOrigin')} options={estados} optionLabel="name" placeholder="Selecciona un estado" className={classNames("w-full md:w-14rem", { 'p-invalid': submitted && !patient.cityOfOrigin })} />
                        </div>
                        {submitted && !patient.cityOfOrigin && <small className="p-error">Selecciona una opci&oacute;n.</small>}
                    </div>
                    <div className='field'>
                        <label className="mb-3">Fecha de nacimiento</label>
                        <div className="card flex">
                            <Calendar value={birthDate} onChange={(e) => {onDateChange(e.value, 'birthDate'), setBirthdate(e.value)}} dateFormat="dd/mm/yy" showIcon className={classNames({ 'p-invalid': submitted && !birthDate })} maxDate={new Date()} />
                        </div>
                        {submitted && !birthDate && <small className="p-error">Selecciona una fecha.</small>}
                    </div>
                </div>
                <div className='flex gap-2'>
                    <div className='field'>
                        <label htmlFor="guardianFullName">Nombre completo del tutor</label>
                        <InputText id="guardianFullName" value={patient.guardianFullName} onChange={(e) => onInputChange(e, 'guardianFullName')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.guardianFullName })} />
                        {submitted && !patient.guardianFullName && <small className="p-error">Campo requerido.</small>}
                    </div>
                    <div className='field'>
                        <label htmlFor="guardianPhone">Tel&eacute;fono del tutor</label>
                        <InputNumber id="guardianPhone" value={patient.guardianPhone} onValueChange={(e) => onInputChange(e, 'guardianPhone')} required autoFocus className={classNames({ 'p-invalid': submitted && !patient.guardianPhone })} useGrouping={false} />
                        {submitted && !patient.guardianPhone && <small className="p-error">Campo requerido.</small>}
                    </div>
                </div>
                <div className='flex gap-8'>
                    <div className='field'>
                        <label className="mb-3">Fecha de inscripci&oacute;n</label>
                        <div className="card flex">
                            <Calendar value={enrollmentDate} onChange={(e) => {onDateChange(e.value, 'enrollmentDate'), setEnrollmentDate(e.value)}} dateFormat="dd/mm/yy" showIcon className={classNames({ 'p-invalid': submitted && !enrollmentDate })} maxDate={new Date()} />
                        </div>
                        {submitted && !enrollmentDate && <small className="p-error">Selecciona una fecha.</small>}
                    </div>
                    <div className='field'>
                        <label className="mb-3">Hospital de origen</label>
                        <div className="card flex">
                        <Dropdown value={patient.hospital} onChange={(e) => {onHospitalChange(e.value)}} options={hospitals} optionLabel="name" placeholder="Selecciona un hospital" className={classNames("w-full md:w-14rem", { 'p-invalid': submitted && !selectedHospital })}/>
                        </div>
                        {submitted && !selectedHospital && <small className="p-error">Selecciona una opci&oacute;n.</small>}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deletePatientDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePatientDialogFooter} onHide={hideDeletePatientDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {patient && <span>¿Estás seguro de eliminar a <b>{patient.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deletePatientsDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePatientsDialogFooter} onHide={hideDeletePatientsDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {patient && <span>¿Estas seguro de eliminar todos los pacientes seleccionados?</span>}
                </div>
            </Dialog>
        </div>
    );
}


