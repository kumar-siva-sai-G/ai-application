import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import MainAppPage from './components/MainAppPage';
// PrismJS will be loaded from CDN, so we remove the direct imports.

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { firebaseConfig } from './firebase/firebaseConfig';

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('login'); // 'login', 'signup', or 'app'

    // Load PrismJS from CDN
    useEffect(() => {
        const prismCss = document.createElement('link');
        prismCss.rel = 'stylesheet';
        prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css';
        document.head.appendChild(prismCss);

        const prismCoreJs = document.createElement('script');
        prismCoreJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
        prismCoreJs.async = true;
        document.head.appendChild(prismCoreJs);
        
        prismCoreJs.onload = () => {
            const prismAutoloaderJs = document.createElement('script');
            prismAutoloaderJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
            prismAutoloaderJs.async = true;
            document.head.appendChild(prismAutoloaderJs);
        };
        
        return () => {
            document.head.removeChild(prismCss);
            document.head.removeChild(prismCoreJs);
            // Autoloader will be removed with core if it loaded
        };
    }, []);

    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                if (user) {
                    setUser(user);
                    setPage('app');
                } else {
                    setUser(null);
                    setPage('login');
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Firebase initialization error:", error);
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        if (auth) {
            signOut(auth).catch(error => console.error("Logout Error:", error));
        }
    };
    
    if (loading) {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) {
        return page === 'login' 
            ? <LoginPage setPage={setPage} auth={auth} /> 
            : <SignUpPage setPage={setPage} auth={auth} />;
    }

    return <MainAppPage user={user} handleLogout={handleLogout} />;
}
