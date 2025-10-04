import React from 'react';
import { downloadContent } from '../api/helpers';

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

export default VideoResult;
