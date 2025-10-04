import React from 'react';
import { downloadContent } from '../api/helpers';

const RecommendationResult = ({ data }) => {
     const recommendationsText = data.map(rec => `Title: ${rec.title}\nType: ${rec.type}\nReason: ${rec.reason}`).join('\n\n---\n\n');
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

export default RecommendationResult;
