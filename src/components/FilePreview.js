import React from 'react';

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

export default FilePreview;
