import { Button, Modal } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import InputField from './InputField';
import { addVaccine } from '../api/profileApi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import jwt from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';

export const ProfileVaccineList = ({ vaccines, setVaccines, addVaccines }) => {

    const [modal, setModal] = useState(false);

    const [vaccineName, setVaccineName] = useState("");
    const [vaccineIssuer, setVaccineIssuer] = useState("");
    const [date, setDate] = useState(new Date());

    const { auth } = useAuth();
    const token = jwt(auth.token);

    const nameRef = useRef();

    // Modal methods
    const handleShow = () => setModal(true);
    const handleHide = () => setModal(false);

    // Handle submit function for vaccine modal
    const handleSubmit = () => {
        let vaccine = {
            name: vaccineName,
            manufacturer: vaccineIssuer,
            date: date
        }

        console.log(vaccine);

        addVaccines(vaccine);
        handleHide();

        let _vaccines = Object.assign(vaccines);
        _vaccines.push(vaccine);
        setVaccines(_vaccines);
    }

    const isIsoDate = str => {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
        var d = new Date(str);
        return d.toISOString() === str;
    }

    const parseISOString = s => {
        if (isIsoDate(s)) {
            var b = s.split(/\D+/);
            return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        } else {
            return s;
        }
    }


    return (
        <>
            <ul className='list-group list-group-flush rounded-3'>
                {vaccines.map((vaccine, index) => {
                    console.log(vaccine.date);
                    const currentDate = new Date();
                    console.log(currentDate);
                    console.log(parseISOString(vaccine.date));
                    const diffTime = Math.abs(currentDate - parseISOString(vaccine.date));
                    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return (
                        <li key={index} className="list-group-item justify-content-left align-items-center p-3">
                            {vaccine.name}: {days} days since last dose
                            {days >= 365 && <p className='text-danger m-0'>Past Due</p>}
                        </li>
                    )
                }
                )}
                <li className="list-group-item justify-content-left align-items-center p-3">
                    <Button variant="primary" onClick={handleShow}>
                        Add a vaccine
                    </Button>
                </li>
                {/* Vaccine modal */}
                <Modal show={modal} onHide={handleHide} onEntered={() => nameRef.current.focus()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row mb-2'>
                            <label htmlFor="vaccine-name">Name</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="vaccine-name" value={vaccineName} setValue={setVaccineName} ref={nameRef} />
                            </div>
                        </div>
                        <div className='row mb-2'>
                            <label htmlFor="vaccine-issuer">Issuer</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="vaccine-issuer" value={vaccineIssuer} setValue={setVaccineIssuer} />
                            </div>
                        </div>
                        <div className='row'>
                            <Calendar value={date} onChange={setDate} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="secondary" onClick={handleHide}>
                            Close
                        </Button>
                        <Button type="button" variant="primary" onClick={handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </ul>
        </>
    )
}