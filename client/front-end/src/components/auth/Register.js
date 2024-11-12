import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {

    const [email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    async function register(e) {
        e.preventDefault();

        try {
            const registerData = {
                email,
                Password,
                passwordVerify
            };

            await axios.post("http://localhost:5000/auth/", registerData, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div>
        <h1>Register a new account</h1>
        <form onSubmit={register}>
            <input
                type='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                value={Password}
             />
            <input
                type='password'
                placeholder='Verify your password'
                onChange={(e) => setPasswordVerify(e.target.value)}
                value={passwordVerify}
            />
            <button type='submit'>Register</button>
        </form>
    </div>
  )
}
