import { Button, Modal } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import InputField from './InputField';

export const ProfileVaccineList = ({ vaccines, addVaccine }) => {

    const [modal, setModal] = useState(false);

    const [vaccineName, setVaccineName] = useState("");
    const [vaccineIssuer, setVaccineIssuer] = useState("");
    const [daysPassed, setDaysPassed] = useState("");

    const nameRef = useRef();

    // Modal methods
    const handleShow = () => setModal(true);
    const handleHide = () => setModal(false);

    const handleSubmit = () => {
        let vaccine = {
            name: vaccineName,
            issuer: vaccineIssuer,
            days_passed: daysPassed
        }

        addVaccine(vaccine);
        handleHide();
        setVaccineName("");
        setVaccineIssuer("");
        setDaysPassed("");
    }

    return (
        <>
            <ul className='list-group list-group-flush rounded-3'>
                {vaccines.map((vaccine, index) =>
                    <li key={index} className="list-group-item justify-content-left align-items-center p-3">
                        {vaccine.name}: {vaccine.days_passed} days since last dose
                        {vaccine.days_passed >= 365 && <p className='text-danger m-0'>Past Due</p>}
                    </li>
                )}
                <li className="list-group-item justify-content-left align-items-center p-3">
                    <Button variant="primary" onClick={handleShow}>
                        Add a vaccine
                    </Button>
                </li>
                <Modal show={modal} onHide={handleHide} onEntered={() => nameRef.current.focus()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Vaccine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <label htmlFor="vaccine-name">Name</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="vaccine-name" value={vaccineName} setValue={setVaccineName} ref={nameRef} />
                            </div>
                        </div>
                        <div className='row'>
                            <label htmlFor="vaccine-issuer">Issuer</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="vaccine-issuer" value={vaccineIssuer} setValue={setVaccineIssuer} />
                            </div>
                        </div>
                        <div className='row'>
                            <label htmlFor="days-passed">Days Passed</label>
                            <div className='col-sm-9'>
                                <InputField type="text" id="days-passed" value={daysPassed} setValue={setDaysPassed} />
                            </div>
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