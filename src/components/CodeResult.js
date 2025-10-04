import React, { useEffect } from 'react';
import { downloadContent, getLanguageExtension } from '../api/helpers';

const CodeResult = ({ data }) => {
    useEffect(() => {
        if (window.Prism) {
            window.Prism.highlightAll();
        }
    }, [data]);
    
    const formattedCode = data.code.replace(/(>)(<)(\/*)/g, '$1\n$2$3');

    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600 relative animate-fade-in">
            <div className="absolute top-4 right-4 flex space-x-2">
                <button onClick={() => navigator.clipboard.writeText(data.code)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Copy</button>
                <button onClick={() => downloadContent(data.code, `code.${getLanguageExtension(data.language)}`)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-md text-sm transition">Download</button>
            </div>
            <pre className="rounded-md max-h-[400px] overflow-auto overflow-x-auto whitespace-pre-line" style={{ whiteSpace: 'pre-wrap' }}>
                <code className={`language-${data.language.toLowerCase()} block`}>{formattedCode}</code>
            </pre>
        </div>
    );
};

export default CodeResult;