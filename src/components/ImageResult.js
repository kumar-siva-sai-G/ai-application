import React from 'react';

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

export default ImageResult;