import {useRef, useEffect, useState} from 'react';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // On page load, focus the username field
    useEffect(() => {
        userRef.current.focus();
    }, []);

    // When the username or password fields are updated, remove any error messages
    useEffect(() => {   
        setError("");
    }, [username, password])

    const handleSubmit = e => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    id="username"
                    ref={userRef} // ref for focusing purposes
                    autoComplete="off"
                    onChange={ e => setUsername(e.target.value) }
                    value={user}
                    required>
                </input>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    onChange={ e => setPassword(e.target.value)}
                    value={password}
                    required>
                </input>
                <button>Login</button>
            </form>
            <p>
                Don't have an account? <br />
                <span>
                    // Add router here
                    <a href="#">Register</a>
                </span>
            </p>
        </div>
    )
}

export default Login;