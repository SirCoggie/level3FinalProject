import {useState} from 'react';
import {loginUser} from '../assets/loginInit'

export default function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState(''); 
    const [response,setResponse] = useState('');

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const data = await loginUser(email,password);
            
            if (data.token) {
                localStorage.setItem('token',data.token)
            }
            
            setResponse("login complete!")
        } catch (error: any) {
            setResponse(`Error: ${error.response || error.message}`)
        }
    };

    return (
        <>
        <form onSubmit={handleLogin}>
        <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Set email here'
        required/>

        <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Set password here'
        required/>

        <button type='submit'>Submit</button>
        </form>

        {response && <p>{response}</p>}
        </>
    )

}