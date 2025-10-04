export function downloadContent(content, fileName) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

export function getLanguageExtension(language) {
    const langMap = { python: 'py', javascript: 'js', typescript: 'ts', html: 'html', css: 'css', java: 'java', csharp: 'cs', cpp: 'cpp', ruby: 'rb', go: 'go', rust: 'rs', shell: 'sh', json: 'json', sql: 'sql' };
    return langMap[language.toLowerCase()] || 'txt';
}
