import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
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
    const firstRender = useRef(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [formValid, setFormValid] = useState(true);

    const [error, setError] = useState("");
    const [success] = useState(false);

    const navigate = useNavigate();

    // On page load, focus the username field
    useEffect(() => {
        userRef.current.focus();
    }, []);

    // Method which facilitates form validation
    const validate = () => {
        if (!USERNAME_REGEX.test(username)) {
            setValidUsername(false);
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

        if (!validUsername || !validPassword) {
            setError("Login failed");
            setFormValid(false);
            return;
        }

        let user = {
            username: username,
            password: password
        };
        try {
            const response = await loginUser(user);

            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
                setUsername("");
                setPassword("");
                setAuth({
                    token: response.accessToken
                });
                navigate("/");
            } else {
                setError("Login failed");
            }
        } catch (err) {
            console.log(err);
            setError("Login failed");
        }
    }

    return (
        <div className="login">
            <div className="text-center bg">
                <form onSubmit={handleSubmit} className="form-signin justify-content-center text-align-center">
                    <img src={vax} className="mb-3" height="200" alt="Vax-Img" />
                    <h1 className="mb-3">Login</h1>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <InputField type="text" id="username" placeholder="" value={username} setValue={setUsername} ref={userRef} />
                        {!validUsername && !formValid && <div className="username-error">
                            <p>Username must be 3 or more characters</p>
                        </div>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <InputField type="password" id="password" placeholder="" value={password} setValue={setPassword}
                            valid={validPassword} setValid={setValidPassword} />
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