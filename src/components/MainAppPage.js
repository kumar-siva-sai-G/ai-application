import React, { useState, useRef } from 'react';
import { getAIResponse, generateImageFromPrompt } from '../api/gemini.js';
import FilePreview from './FilePreview';
import ResultDisplay from './ResultDisplay';

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

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
            console.log('AI Response:', aiResponse);

            let imageData = null;
            if (aiResponse.imagePrompt) {
                imageData = await generateImageFromPrompt(aiResponse.imagePrompt);
            }

            // Consolidate results
            const finalResult = {
                type: 'aiResponse',
                data: aiResponse,
                imageData: imageData,
                videoPrompt: aiResponse.videoPrompt
            };
            setResult(finalResult);

        } catch (err) {
            console.error("Error during AI processing:", err);
            let errorMessage = 'An error occurred. Please check the console and try again.';
            if (err.message.includes('403')) {
                errorMessage = 'API call failed (Error 403): This usually means there is a problem with the API key. Please ensure your keys are correct and active.';
            } else if (err.message.includes('400')) {
                errorMessage = 'Image generation API failed (Error 400): This may be due to an invalid prompt or an issue with your API key. Please check your prompt and ensure your OpenAI API key is correctly configured.';
            } else if (err.message.includes('Image generation prompt is empty or invalid')) {
                errorMessage = 'The AI failed to generate a valid prompt for the image. Please try rephrasing your request.';
            } else if (err.message.includes('API key not valid')) {
                errorMessage = 'Your Google AI API Key is not valid. Please check that you have pasted it correctly.';
            } else if (err.message.includes('OpenAI API key is not configured')) {
                errorMessage = 'Your OpenAI API key is not configured. Please set REACT_APP_OPENAI_API_KEY in your .env file.';
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
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Personal AI Librarian</h1>
                </div>
                <p className="text-left text-gray-400 -mt-4 mb-8">Welcome, {user.email}</p>

                <div className="space-y-4">
                    <div className="relative">
                        <textarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows="4" 
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 pr-12"
                            placeholder="e.g., 'Summarize the attached document' or 'What is this a picture of?'"
                        />
                        <button onClick={handleGenerateClick} disabled={isLoading} className="absolute top-1/2 right-4 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full transition disabled:bg-blue-800 disabled:cursor-not-allowed">
                            {isLoading ? <div className="loader-small"></div> : <ArrowIcon />}
                        </button>
                    </div>
                    
                    {uploadedFile && <FilePreview file={uploadedFile} previewSrc={filePreview} onClear={clearFile} />}
                    
                    <div className="flex items-center space-x-4">
                         <label htmlFor="file-input" className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition text-center">
                            <UploadIcon />
                        </label>
                        <input type="file" id="file-input" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*, text/plain, text/markdown, text/csv, application/pdf, application/json" />
                    </div>
                </div>
                
                <div className="mt-10 min-h-[100px]">
                    {isLoading && <div className="flex justify-center items-center"><div className="loader"></div></div>}
                    {error && <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">{error}</div>}
                    {!isLoading && !result && <div className="text-center text-gray-500">Your AI-powered answer will appear here. You can also ask for code snippets.</div>}
                    {result && <ResultDisplay result={result} />}
                </div>
            </div>
            <button onClick={handleLogout} className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Logout</button>
        </div>
    );
};

export default MainAppPage;