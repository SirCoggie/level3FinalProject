import {useState} from 'react';
import {registerUser} from '../assets/loginInit'

export default function Register() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [message,setResponse] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            await registerUser(email,password);
            setResponse("Regsisteration Successful!")
        } catch (error: any) {
            setResponse(`Error: ${error.response?.data?.detail || error.message}`)
        }
    };

    return (
        <>
            <div>Register</div>
            <form onSubmit={handleSubmit}>
                <input type="email"
                placeholder='set email here'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <input type="password"
                placeholder='set password here'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <button type='submit'>Submit</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );

}
