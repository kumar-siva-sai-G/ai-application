import React from 'react';
import RecommendationResult from './RecommendationResult';
import AnswerResult from './AnswerResult';
import CodeResult from './CodeResult';
import ImageResult from './ImageResult';
import VideoResult from './VideoResult';

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

export default ResultDisplay;
