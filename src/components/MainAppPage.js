import React, { useState, useRef } from 'react';
import { getAIResponse, generateImageFromPrompt } from '../api/gemini';
import FilePreview from './FilePreview';
import ResultDisplay from './ResultDisplay';

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

export default MainAppPage;
