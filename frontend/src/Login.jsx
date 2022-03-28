import { useRef, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthProvider';

const Login = () => {
    const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,}$/;
    const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{3,}$/;

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [validUsername, setValidUsername] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const admin = {
        username: 'cjgamble21',
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
            setError('Error!');
        }
    }

    return (
        <>
            {success ? (
                <div className="login-success-page">
                    <h1>You have been logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </div>
            ) : (
                <div className="login-wrapper">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef} // ref for focusing purposes
                            autoComplete="off"
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            required>
                        </input>
                        {!validUsername && <div className="username-error">
                            <p>Please provide a username with 3 or more characters</p>
                        </div>}

                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            required>
                        </input>
                        {!validPassword && <div className="password-error">
                            <p>Please provide a password with 3 or more characters</p>
                        </div>}

                        <button>Login</button>
                    </form>
                    <p>
                        Don't have an account? <br />
                        <span className='register-link'>
                            {/* Add router here */}
                            <a href="#">Register</a>
                        </span>
                    </p>
                </div>
            )}
        </>
    )
}

export default Login;