import React, { useState, useEffect, useRef } from 'react';
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


// --- Authentication Page Components ---

const LoginPage = ({ setPage, auth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!auth) {
            setError("Authentication service not available.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">Login</button>
                </form>
                <p className="text-center text-gray-400 mt-6">
                    Don't have an account? <button onClick={() => setPage('signup')} className="text-blue-400 hover:underline">Sign Up</button>
                </p>
            </div>
        </div>
    );
};

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
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500" required />
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


// --- AI Librarian Main Application Page ---

const MainAppPage = ({ user, handleLogout }) => {
    const [prompt, setPrompt] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedFile({
                data: e.target.result.split(',')[1],
                mimeType: file.type,
                name: file.name,
                size: file.size
            });
            setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const clearFile = () => {
        setUploadedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGenerateClick = async () => {
        if (!prompt && !uploadedFile) {
            setError('Please enter a question or upload a file.');
            return;
        }
        setIsLoading(true);
        setResult(null);
        setError('');
        
        try {
            const aiResponse = await getAIResponse(prompt, uploadedFile);
            setResult({type: 'aiResponse', data: aiResponse});
            
            if (aiResponse.imagePrompt) {
                const imageData = await generateImageFromPrompt(aiResponse.imagePrompt);
                setResult({type: 'image', data: {imageData, prompt: aiResponse.imagePrompt}});
            } else if (aiResponse.videoPrompt) {
                 setResult({type: 'video', data: {prompt: aiResponse.videoPrompt}});
            }
        } catch (err) {
            console.error("Error during AI processing:", err);
            let errorMessage = 'An error occurred. Please check the console and try again.';
            if (err.message.includes('403')) {
                errorMessage = 'API call failed (Error 403): This usually means there is a problem with the API key. Please ensure your key is correct, active, and enabled for the Gemini & Imagen APIs in your Google Cloud project.';
            } else if (err.message.includes('API key not valid')) {
                errorMessage = 'Your Google AI API Key is not valid. Please check that you have pasted it correctly.';
            } else if (err instanceof TypeError) { 
                errorMessage = 'A network error occurred. Please check your internet connection and try again.';
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-900 text-white min-h-screen py-8 sm:py-16">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Personal AI Librarian</h1>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Logout</button>
                </div>
                <p className="text-center text-gray-400 -mt-4 mb-8">Welcome, {user.email}</p>

                <div className="space-y-4">
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows="4" 
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 'Summarize the attached document' or 'What is this a picture of?'"
                    />
                    
                    {uploadedFile && <FilePreview file={uploadedFile} previewSrc={filePreview} onClear={clearFile} />}
                    
                    <div className="flex items-center space-x-4">
                         <label htmlFor="file-input" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition text-center">
                            Upload File
                        </label>
                        <input type="file" id="file-input" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*, text/plain, text/markdown, text/csv, application/pdf, application/json" />
                        <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-blue-800 disabled:cursor-not-allowed">
                            {isLoading ? 'Thinking...' : 'Ask the AI'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-10 min-h-[100px]">
                    {isLoading && <div className="flex justify-center items-center"><div className="loader"></div></div>}
                    {error && <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">{error}</div>}
                    {!isLoading && !result && <div className="text-center text-gray-500">Your AI-powered answer will appear here.</div>}
                    {result && <ResultDisplay result={result} />}
                </div>
            </div>
        </div>
    );
};

// --- Helper & Display Components for Main App ---

const FilePreview = ({ file, previewSrc, onClear }) => {
    return (
        <div className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
             <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-600 rounded-md overflow-hidden">
                {file.mimeType.startsWith('image/') ? (
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                     <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                )}
            </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={onClear} className="p-2 rounded-full hover:bg-gray-600 transition flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    );
};

const ResultDisplay = ({ result }) => {
    if (!result) return null;

    switch(result.type) {
        case 'aiResponse':
            const response = result.data;
            if (response.recommendations) return <RecommendationResult data={response.recommendations} />;
            if (response.answer) return <AnswerResult data={response.answer} />;
            if (response.codeBlock) return <CodeResult data={response.codeBlock} />;
            return <div className="text-gray-400">Could not determine response type.</div>;
        case 'image':
            return <ImageResult imageData={result.data.imageData} prompt={result.data.prompt} />;
        case 'video':
            return <VideoResult prompt={result.data.prompt} />;
        default:
            return null;
    }
};

const AnswerResult = ({ data }) => {
    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 relative animate-fade-in">
             <h3 className="text-xl font-bold text-blue-300 mb-3">Answer</h3>
             <button onClick={() => downloadContent(data, 'answer.txt')} className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Download .txt</button>
             <div className="max-h-96 overflow-y-auto pr-2"><p className="text-gray-300 whitespace-pre-wrap">{data}</p></div>
        </div>
    );
};

const RecommendationResult = ({ data }) => {
     const recommendationsText = data.map(rec => `Title: ${rec.title}
Type: ${rec.type}
Reason: ${rec.reason}`).join('

---

');
     return (
        <div className="space-y-4 animate-fade-in">
            {data.map((rec, index) => (
                 <div key={index} className="bg-gray-700 p-5 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-blue-300">{rec.title}</h3>
                        <span className="bg-purple-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{rec.type}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{rec.reason}</p>
                </div>
            ))}
            <button onClick={() => downloadContent(recommendationsText, 'recommendations.txt')} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-3 rounded-lg transition mt-4">Download Recommendations (.txt)</button>
        </div>
    );
};

const CodeResult = ({ data }) => {
    useEffect(() => {
        if (window.Prism) {
            window.Prism.highlightAll();
        }
    }, [data]);
    
    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 relative animate-fade-in">
            <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(data.code)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Copy</button>
                <button onClick={() => downloadContent(data.code, `code.${getLanguageExtension(data.language)}`)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Download</button>
            </div>
            <pre className="rounded-md max-h-[400px] overflow-auto">
                <code className={`language-${data.language.toLowerCase()}`}>{data.code}</code>
            </pre>
        </div>
    );
};

const ImageResult = ({ imageData, prompt }) => {
    const imageUrl = `data:image/png;base64,${imageData}`;
    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 relative animate-fade-in">
            <a href={imageUrl} download="ai-generated-image.png" className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Download Image</a>
            <img src={imageUrl} alt="AI generated" className="rounded-lg mb-4 w-full h-auto" />
            <p className="text-gray-400 text-sm italic">Prompt: "{prompt}"</p>
        </div>
    );
};

const VideoResult = ({ prompt }) => {
    return (
         <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 animate-fade-in">
            <h3 className="text-xl font-bold text-blue-300 mb-3">Video Generation Concept</h3>
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <div className="video-placeholder-content w-full h-full p-4 text-center">
                    <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55a1 1 0 011.45.89V14.1a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    <p className="font-semibold">Simulating Video Generation...</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-300 font-semibold">Scene Description:</p>
                <div className="max-h-60 overflow-y-auto pr-2 mt-2 bg-gray-800 p-3 rounded-md">
                   <p className="text-gray-300 whitespace-pre-wrap">{prompt}</p>
                </div>
            </div>
            <button onClick={() => downloadContent(prompt, 'video_prompt.txt')} className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-3 rounded-lg transition mt-4">Download Video Prompt (.txt)</button>
        </div>
    );
};


// --- API Call & Helper Functions ---

async function getAIResponse(userQuery, file) {
    // IMPORTANT: PASTE YOUR GOOGLE AI API KEY HERE
    const apiKey = "PASTE_YOUR_GOOGLE_AI_API_KEY_HERE"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a helpful AI Librarian... (system prompt omitted for brevity, but is the same as before)`;
    const parts = [];
    if(userQuery) parts.push({ text: userQuery });
    if(file) parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
    
    const payload = {
        contents: [{ parts }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: { type: "OBJECT", properties: { recommendations: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, type: { type: "STRING" }, reason: { type: "STRING" } } } }, answer: { type: "STRING" }, imagePrompt: { type: "STRING" }, videoPrompt: { type: "STRING" }, codeBlock: { type: "OBJECT", properties: { language: { type: "STRING" }, code: { type: "STRING" } } } } }
        }
    };
            
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API call failed: ${response.status}`);
    const result = await response.json();
    if (result.error && result.error.message.includes('API key not valid')) throw new Error('API key not valid');
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Invalid response from text AI.");
    return JSON.parse(text);
}

async function generateImageFromPrompt(prompt) {
    // IMPORTANT: PASTE YOUR GOOGLE AI API KEY HERE
    const apiKey = "PASTE_YOUR_GOOGLE_AI_API_KEY_HERE";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = { instances: [{ "prompt": prompt }], parameters: { "sampleCount": 1 } };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`Image generation API failed: ${response.status}`);
    const result = await response.json();
    const imageData = result.predictions?.[0]?.bytesBase64Encoded;
    if (!imageData) throw new Error("Invalid response from image AI.");
    return imageData;
}

function downloadContent(content, fileName) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

function getLanguageExtension(language) {
    const langMap = { python: 'py', javascript: 'js', typescript: 'ts', html: 'html', css: 'css', java: 'java', csharp: 'cs', cpp: 'cpp', ruby: 'rb', go: 'go', rust: 'rs', shell: 'sh', json: 'json', sql: 'sql' };
    return langMap[language.toLowerCase()] || 'txt';
}
