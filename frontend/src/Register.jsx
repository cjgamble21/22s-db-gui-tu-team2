import { useRef, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import vax from './images/Vax.png';


const Register = () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
    const PASSWORD_REGEX = /^[a-zA-Z0-9_-]{3,}$/;

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidUsername(true);
        setValidPassword(true);
        setPasswordConfirmation(true);
    }, [username, password, passwordConfirmation])

    // Method which facilitates form validation
    const validate = () => {
        if (!USERNAME_REGEX.test(username)) {
            setValidUsername(false);
        }

        if (!PASSWORD_REGEX.test(password)) {
            setValidPassword(false);
        }

        if (password !== passwordConfirmation) {
            setPasswordsMatch(false);
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        validate();

        if (validUsername && validPassword && passwordsMatch) {
            console.log("Success!");
            setSuccess(true);
        }
    }

    return (
        <div className="register">
            {success ? (
                <div className="register-success-page">
                    {navigate("/")}
                </div>
            ) : (
                <div className="text-center bg">
                    <form onSubmit={handleSubmit} className="form-signin justify-content-center text-align-center">
                        <img src={vax} className="mb-3" height="200" alt="Vax-Img" />
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
                                <p>Username must be 3 or more characters</p>
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
                                <p>Password must be 3 or more characters</p>
                            </div>}
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="passwordConfirmation">Confirm Password</label>
                            <input
                                type="password"
                                id="passwordConfirmation"
                                className="form-control"
                                onChange={e => setPasswordConfirmation(e.target.value)}
                                value={passwordConfirmation}
                                required>
                            </input>
                        </div>
                        {!passwordConfirmation && <div className="confirmation-error">
                            <p>Passwords must match</p>
                        </div>}

                        <div className="mt-3 mb-3">
                            <button className="btn btn-lg btn-primary w-100">Login</button>
                        </div>
                        {/* {error && <div className="login-error">
                            <p>{error}</p>
                        </div>} */}
                    </form>
                </div>
            )}
        </div>
    )
}

export default Register;