import { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { Modal, Button } from 'react-bootstrap';
import { StaticProfileInfo, DynamicProfileInfo } from './ProfileInfo';


const Profile = () => {
    const [profile, setProfile] = useState({});
    const [modal, setModal] = useState(false);
    const { auth } = useAuth();
    // const username = jwt(auth.token).username;
    let username = null;
    // console.log(username);

    // Modal methods
    const handleShow = () => setModal(true);
    const handleHide = () => setModal(false);

    const vaccines = [
        {
            name: 'COVID-19',
            issuer: 'Pfizer',
            days_passed: 20
        },
        {
            name: 'Swine flu',
            issuer: 'Pfizer',
            days_passed: 130
        }
    ]

    // Need to call user from the API here...I'll create a basic user for now
    let user = {
        username: 'cjgamble21',
        first_name: 'Connor',
        last_name: 'Gamble',
        email: 'cjgamble21@gmail.com',
        age: 21,
        organization: 'Southern Methodist University'
    }

    return (
        <div className='container py-5'>
            <div className='row'>
                <div className='col'>
                    <nav aria-label="breadcrumb" className="bg-light rounded-3 p-3 mb-4">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item"><a href="#">User</a></li>
                            <li className="breadcrumb-item active" aria-current='page'>User Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className='card mb-4'>
                        <div className="card-body text-center">
                            <img src="https://via.placeholder.com/150" alt="avatar" className="rounded-circle img-fluid w-3" />
                            <h5 className='my-3'> {user.first_name} {user.last_name} </h5>
                            <p className='text-muted mb-1'>{user.username}</p>
                            <p className='text-muted mb-1'>{user.email}</p>
                            <p className='mb-4 fw-bold'>{user.organization}</p>
                        </div>
                    </div>
                    <div className='card mb-4 mb-lg-0'>
                        <div className='card-header'>
                            Vaccine List
                        </div>
                        <div className='card-body p-0'>
                            <ul className='list-group list-group-flush rounded-3'>
                                {vaccines.map((vaccine, index) =>
                                    <li key={index} className="list-group-item justify-content-left align-items-center p-3">
                                        {vaccine.name}: {vaccine.days_passed} days since last dose
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <h5>User Information</h5>
                        </div>
                        <div className='card-body'>
                            <StaticProfileInfo firstName={user.first_name} lastName={user.last_name}
                                age={user.age} email={user.email} username={user.username} />
                            <hr />
                            <div className='row'>
                                <div className='col-sm-10'>
                                    <Button variant="primary" onClick={handleShow}>
                                        Edit
                                    </Button>

                                    <Modal show={modal} onHide={handleHide}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Edit Profile</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <DynamicProfileInfo firstName={user.first_name} lastName={user.last_name}
                                                age={user.age} email={user.email} username={user.username} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleHide}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleHide}>
                                                Save
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;