import { useRef, useEffect, useState, useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import vax from '../../images/Vax.png';
import InputField from '../InputField';
import { registerUser, loginUser } from '../../api/sessionApi';


const Register = () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
    const PASSWORD_REGEX = /^[a-zA-Z0-9_-]{3,}$/;

    const { setAuth } = useAuth();
    const userRef = useRef();
    const passRef = useRef();
    const confRef = useRef();
    const firstRender = useRef(true);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [formValid, setFormValid] = useState(true);

    const [error, setError] = useState("");
    const [success] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus();
    }, [])


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

        if (password !== passwordConfirmation) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        validate();
    }, [username, password, passwordConfirmation])


    const handleSubmit = async e => {
        e.preventDefault();

        if (!validUsername || !validPassword || !passwordsMatch) {
            setError("Registration failed");
            setFormValid(false);
            return;
        }

        let user = {
            username: username,
            password: password
        }

        try {
            const response = await registerUser(user);

            if (response === 200) {
                try {
                    const res = await loginUser(user);
                    console.log(res);
                    if (res?.accessToken) {
                        localStorage.setItem("accessToken", response.accessToken);
                        setUsername("");
                        setPassword("");
                        setPasswordConfirmation("");
                        setAuth({
                            token: res.accessToken
                        })
                        navigate("/");
                    }
                } catch (err) {
                    console.log(err);
                }
            } else {
                setError("Registration failed");
            }

        } catch (err) {
            console.log(err);
            setError("Registration failed");
        }



        // if (validUsername && validPassword && passwordsMatch) {
        //     console.log("Success!");
        //     setSuccess(true);
        //     setAuth({ username, password });
        //     navigate('/');
        // } else {
        //     console.log("Failure");
        //     setError('Registration failed.');
        // }
    }

    return (
        <div className="register">
            <div className="text-center bg">
                <form onSubmit={handleSubmit} className="form-signin justify-content-center text-align-center">
                    <img src={vax} className="mb-3" height="200" alt="Vax-Img" />
                    <h1 className="mb-3">Register</h1>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <InputField type="text" id="username" value={username} setValue={setUsername} ref={userRef} />
                        {!validUsername && !formValid && <div className="username-error">
                            <p>Username must be 3 or more characters</p>
                        </div>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <InputField type="password" id="password" value={password} setValue={setPassword} ref={passRef} />
                        {!validPassword && !formValid && <div className="password-error">
                            <p>Password must be 3 or more characters</p>
                        </div>}
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="confirmation">Confirm Password</label>
                        <InputField type="password" id="confirmation" value={passwordConfirmation} setValue={setPasswordConfirmation} ref={confRef} />
                    </div>
                    {!passwordsMatch && !formValid && <div className="confirmation-error">
                        <p>Passwords must match</p>
                    </div>}

                    <div className="mt-3 mb-3">
                        <button className="btn btn-lg btn-primary w-100">Register</button>
                    </div>
                    {!success && <div className="login-error">
                        <p>{error}</p>
                    </div>}

                    <div className="mt-3">
                        <p>
                            Already have an account? <br />
                            <span>
                                <Link to="/login">Login</Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;