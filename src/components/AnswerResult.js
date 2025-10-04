import React from 'react';
import { downloadContent } from '../api/helpers';

const AnswerResult = ({ data }) => {
    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 relative animate-fade-in">
             <h3 className="text-xl font-bold text-blue-300 mb-3">Answer</h3>
             <button onClick={() => downloadContent(data, 'answer.txt')} className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Download .txt</button>
             <div className="max-h-96 overflow-y-auto pr-2"><p className="text-gray-300 whitespace-pre-wrap">{data}</p></div>
        </div>
    );
};

export default AnswerResult;