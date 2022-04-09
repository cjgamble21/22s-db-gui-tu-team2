import { useRef, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import vax from '../../images/Vax.png';
import InputField from '../InputField';
import { loginUser } from '../../api/sessionApi';

const Login = () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
    const PASSWORD_REGEX = /^[a-zA-Z0-9_-]{3,}$/;

    const { setAuth } = useAuth();
    const userRef = useRef();
    const passwordRef = useRef();
    const firstRender = useRef(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [formValid, setFormValid] = useState(true);

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
    // useEffect(() => {
    //     setValidUsername(true);
    //     setValidPassword(true);
    //     setSuccess(false);
    // }, [username, password])


    // Method which facilitates form validation
    const validate = () => {
        if (!USERNAME_REGEX.test(username)) {
            setValidUsername(false);
            console.log("Set to false")
        } else {
            setValidUsername(true);
        }

        if (!PASSWORD_REGEX.test(password)) {
            setValidPassword(false);
        } else {
            setValidPassword(true);
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        validate();
    }, [username, password])

    // Function for handling login form submission
    const handleSubmit = async e => {
        e.preventDefault();
        console.log(username, password);
        console.log(success);

        if (!validUsername || !validPassword) {
            setError("Login failed.");
            setFormValid(false);
            return;
        }

        // validate();

        console.log(validUsername);
        console.log(validPassword);

        let user = {
            username: username,
            password: password
        };
        try {
            const response = await loginUser(user);
            // localStorage.setItem("accessToken", response.accessToken);
            // const token = localStorage.getItem("accessToken");
            // console.log(token);
            if (response?.accessToken) {
                // console.log(token);
                localStorage.setItem("accessToken", response.accessToken);
                setAuth({
                    accessToken: localStorage.getItem("accessToken")
                });
            }
            navigate("/");
            console.log(response);
        } catch (err) {
            console.log(err);
        }

        // Obviously, this will be changed to an API call once the backend registration is set up
        // if (username === admin.username && password === admin.password) {
        //     setAuth({ username, password });
        //     setUsername("");
        //     setPassword("");
        //     setSuccess(true);
        //     navigate('/');
        //     console.log("Logged in!");
        // } else {
        //     console.log("Login unsuccessful!");
        //     console.log(error);
        //     setError('Login failed.');
        // }
    }

    return (
        <div className="login">
            <div className="text-center bg">
                <form onSubmit={handleSubmit} className="form-signin justify-content-center text-align-center">
                    <img src={vax} className="mb-3" height="200" alt="Vax-Img" />
                    <h1 className="mb-3">Login</h1>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <InputField type="text" id="username" value={username} setValue={setUsername} ref={userRef} />
                        {!validUsername && !formValid && <div className="username-error">
                            <p>Username must be 3 or more characters</p>
                        </div>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <InputField type="password" id="password" value={password} setValue={setPassword}
                            valid={validPassword} setValid={setValidPassword} ref={passwordRef} />
                        {!validPassword && !formValid && <div className="password-error">
                            <p>Password must be 3 or more characters</p>
                        </div>}
                    </div>

                    <div className="mt-3 mb-3">
                        <button className="btn btn-lg btn-primary w-100">Login</button>
                    </div>
                    {!success && <div className="login-error">
                        <p>{error}</p>
                    </div>}

                    <div className="mt-4">
                        <p>
                            Don't have an account? <br />
                            <span className='register-link'>
                                <Link to="/register">Register</Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;