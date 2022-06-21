import { Button, Modal } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import InputField from './InputField';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { deleteVaccine } from '../api/profileApi';
import { useAuth } from '../hooks/useAuth';
import jwt from 'jwt-decode';

export const ProfileVaccineList = ({ vaccines, setVaccines, addVaccines }) => {

    const { auth } = useAuth();
    const token = jwt(auth.token);


    const [addModal, setAddModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [vaccineName, setVaccineName] = useState("");
    const [vaccineIssuer, setVaccineIssuer] = useState("");
    const [date, setDate] = useState(new Date());

    const addNameRef = useRef();

    const [checkedState, setCheckedState] = useState(
        new Array(vaccines.length).fill(false)
    );

    // Modal methods
    const showAdd = () => setAddModal(true);
    const showDelete = () => setDeleteModal(true);

    const hideAdd = () => setAddModal(false);
    const hideDelete = () => setDeleteModal(false);

    // Handle submit function for vaccine modal
    const addSubmit = () => {
        let vaccine = {
            name: vaccineName,
            manufacturer: vaccineIssuer,
            date: date,
        }

        console.log(vaccine);

        addVaccines(vaccine);
        hideAdd();

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

    const handleCheckChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
    }

    const deleteSubmit = () => {
        let _vaccines = Object.assign(vaccines);
        vaccines.forEach(async (vaccine, index) => {
            if (checkedState[index]) {
                const status = await deleteVaccine(token.id, vaccine.name);
                console.log(status);
                _vaccines.splice(index);
                console.log(_vaccines);
            }
        })

        setVaccines(_vaccines);
        hideDelete();
    }


    useEffect(() => {
        console.log(vaccines);
        setCheckedState(new Array(vaccines.length).fill(false));
    }, [vaccines, setVaccines])

    useEffect(() => {

    }, [setVaccines])

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
                    <Button variant="primary" onClick={showAdd}>
                        Add a vaccine
                    </Button>
                    {vaccines.length > 0 && <Button variant="danger" className='float-end' onClick={showDelete}>
                        Delete a vaccine
                    </Button>}
                </li>
                {/* Vaccine modal */}
                <Modal show={addModal} onHide={hideAdd} onEntered={() => addNameRef.current.focus()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row mb-2'>
                            <label htmlFor="vaccine-name">Name</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="vaccine-name" value={vaccineName} setValue={setVaccineName} ref={addNameRef} />
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
                        <Button type="button" variant="secondary" onClick={hideAdd}>
                            Close
                        </Button>
                        <Button type="button" variant="primary" onClick={addSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={deleteModal} onHide={hideDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete a vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className='list-group rounded-3'>
                            {vaccines.map((vaccine, index) => {
                                console.log(vaccine);
                                console.log(checkedState)
                                return (
                                    <li key={index} className="list-group-item justify-content-left align-items-center p-3">
                                        <input type="checkbox"
                                            id="check"
                                            name={vaccine.name}
                                            label={vaccine.name}
                                            value={vaccine.name}
                                            checked={checkedState[index]}
                                            onChange={() => handleCheckChange(index)} />
                                        <label htmlFor="check" className="ms-3">{vaccine.name}</label>
                                    </li>
                                )
                            })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="secondary" onClick={hideDelete}>
                            Close
                        </Button>
                        <Button type="button" variant="danger" onClick={deleteSubmit}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </ul>
        </>
    )
}