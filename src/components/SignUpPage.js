import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpPage = ({ setPage, auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        if (!auth) {
            setError("Authentication service not available.");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                <form onSubmit={handleSignUp} className="space-y-6">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required autoComplete="email" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required autoComplete="new-password" />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Sign Up</button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Already have an account? <button onClick={() => setPage('login')} className="text-blue-400 hover:underline">Login</button>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
