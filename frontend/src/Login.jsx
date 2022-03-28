import { useRef, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import vax from './images/Vax.png';

const Login = () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{3,}$/;

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const admin = {
        username: 'user',
        password: '1234'
    }

    // On page load, focus the username field
    useEffect(() => {
        userRef.current.focus();
    }, []);

    // When the username or password fields are updated, remove any error messages
    useEffect(() => {
        setValidUsername(true);
        setValidPassword(true);
    }, [username, password])

    const validate = () => {
        if (!USERNAME_REGEX.test(username)) {
            setValidUsername(false);
        }

        if (!PASSWORD_REGEX.test(password)) {
            setValidPassword(false);
        }
    }

    // Function for handling login form submission
    const handleSubmit = e => {
        e.preventDefault();
        console.log(username, password);

        validate();

        // Obviously, this will be changed to an API call once the backend registration is set up
        if (username === admin.username && password === admin.password) {
            setAuth({ username, password });
            setSuccess(true);
            setUsername("");
            setPassword("");
            console.log("Logged in!");
        } else {
            console.log("Login unsuccessful!");
            console.log(error);
            setError('Login failed.');
        }
    }

    return (
        <div className="login">
            {success ? (
                <div className="login-success-page">
                    {navigate("/")}
                </div>
            ) : (
                <div className="text-center mt-5">
                    <form onSubmit={handleSubmit} className="form-signin">
                        <img src={vax} className="vax-img mb-3" height="200" />
                        <h1 className="mb-3">Login</h1>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                ref={userRef} // ref for focusing purposes
                                autoComplete="off"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                required>
                            </input>
                            {!validUsername && <div className="username-error">
                                <p>Please provide a username with 3 or more characters</p>
                            </div>}
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                required>
                            </input>
                            {!validPassword && <div className="password-error">
                                <p>Please provide a password with 3 or more characters</p>
                            </div>}
                        </div>

                        <div className="mt-3 mb-3">
                            <button className="btn btn-lg btn-primary w-100">Login</button>
                        </div>
                        {error && <div className="login-error">
                            <p>{error}</p>
                        </div>}

                        <div className="mt-4">
                            <p>
                                Don't have an account? <br />
                                <span className='register-link'>
                                    {/* Add router here */}
                                    <a href="#">Register</a>
                                </span>
                            </p>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Login;