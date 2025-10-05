import React from 'react';
import RecommendationResult from './RecommendationResult';
import AnswerResult from './AnswerResult';
import CodeResult from './CodeResult';
import ImageResult from './ImageResult';
import VideoResult from './VideoResult';

const ResultDisplay = ({ result }) => {
    if (!result) return null;

    const { data, imageData, videoPrompt } = result;

    return (
        <div className="space-y-4">
            {imageData && <ImageResult imageData={imageData} prompt={data.imagePrompt} />}
            {!imageData && data.imagePrompt && <div className="bg-gray-700 p-4 rounded-lg"><strong>Image Prompt:</strong> {data.imagePrompt}</div>}
            {videoPrompt && <VideoResult prompt={videoPrompt} />}
            {data.answer && <AnswerResult data={data.answer} />}
            {data.recommendations && <RecommendationResult data={data.recommendations} />}
            {data.codeBlock && <CodeResult data={data.codeBlock} />}
            {!imageData && !data.imagePrompt && !videoPrompt && !data.answer && !data.recommendations && !data.codeBlock &&
                <div className="text-gray-400">Could not determine response type.</div>
            }
        </div>
    );
};

export default ResultDisplay;