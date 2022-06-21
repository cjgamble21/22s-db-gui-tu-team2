import { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { Form, Modal, Button } from 'react-bootstrap';
import { StaticProfileInfo, DynamicProfileInfo } from './ProfileInfo';
import { ProfileVaccineList } from './ProfileVaccineList';
import { useNavigate } from 'react-router-dom';
import { getUserById, updateUserInfo, addVaccine, getVaccines } from '../api/profileApi';


const Profile = () => {
    const [profile, setProfile] = useState({});
    const [modal, setModal] = useState(false);
    const { auth } = useAuth();
    const token = jwt(auth.token);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState(0);
    const [vaccines, setVaccines] = useState([]);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    // Modal methods
    const handleShow = () => setModal(true);
    const handleHide = () => setModal(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitted!");
        console.log(name, age, email, username);
        const status = await updateUserInfo(token.id, { name, age, email, username });
        console.log(status);
        setModal(false);
    }

    const addVaccines = async vaccine => {
        const response = await addVaccine(token.id, vaccine)
        console.log(response);
        console.log(vaccines);
    }

    useEffect(async () => {
        const data = await getUserById(token.id);
        let _user = data.data[0]

        if (_user.name && _user.name != token.username)
            token.username = Object.assign(_user.name);

        setName(_user.name);
        setEmail(_user.email);
        setUsername(_user.username);
        setAge(_user.age);
        console.log(token);
        console.log(_user);

        const _vaccines = await getVaccines(token.id);
        setVaccines(_vaccines.data);
        console.log(_vaccines.data);
    }, [])

    // const vaccines = [
    //     {
    //         name: 'COVID-19',
    //         issuer: 'Pfizer',
    //         days_passed: 20
    //     },
    //     {
    //         name: 'Measles',
    //         issuer: 'Pfizer',
    //         days_passed: 130
    //     },
    //     {
    //         name: 'Tetanus',
    //         issuer: 'J&J',
    //         days_passed: 365
    //     }
    // ]

    // Need to call user from the API here...I'll create a basic user for now
    let user = {
        // username: 'cjgamble21',
        // first_name: 'Connor',
        // last_name: 'Gamble',
        // email: 'cjgamble21@gmail.com',
        // age: 21,
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
                            <h5 className='my-3'> {name} </h5>
                            <p className='text-muted mb-1'>{username}</p>
                            <p className='text-muted mb-1'>{email}</p>
                            <p className='mb-4 fw-bold'>{user.organization}</p>
                            <Button variant="primary" className='mb-4' onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-4 mb-lg-0'>
                        <div className='card-header'>
                            Vaccine List
                        </div>
                        <div className='card-body p-0'>
                            <ProfileVaccineList vaccines={vaccines} setVaccines={setVaccines} addVaccines={addVaccines} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className='card mb-4'>
                        <div className='card-header'>
                            <h5>User Information</h5>
                        </div>
                        <div className='card-body'>
                            <StaticProfileInfo name={name}
                                age={age} email={email} username={username} organization={user.organization} />
                            <hr />
                            <div className='row'>
                                <div className='col-sm-10'>
                                    <Button variant="primary" onClick={handleShow}>
                                        Edit
                                    </Button>
                                    <Modal show={modal} onSubmit={handleSubmit}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Edit Profile</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <DynamicProfileInfo name={name} setName={setName}
                                                age={age} setAge={setAge} email={email} setEmail={setEmail} username={username}
                                                setUsername={setUsername} organization={user.organization} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleHide}>
                                                Close
                                            </Button>
                                            <Button variant="primary" onClick={handleSubmit}>
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