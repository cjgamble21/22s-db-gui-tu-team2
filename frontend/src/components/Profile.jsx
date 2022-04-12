import { useState, useEffect } from 'react';
import jwt from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { flushSync } from 'react-dom';


const Profile = () => {
    const [profile, setProfile] = useState({});
    const { auth } = useAuth();
    // const username = jwt(auth.token).username;
    let username = null;
    // console.log(username);

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
        email: 'cjgamble21@gmail.com'
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
                            <p className='text-muted mb-4'>{user.email}</p>
                        </div>
                    </div>
                </div>
                <div className='card mb-4 mb-lg-0'>
                    <div className='card-body p-0'>
                        <ul className='list-group list-group-flush rounded-3'>

                        </ul>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile;