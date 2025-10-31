import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSave = () => {
        if (apiKey.trim()) {
            onSave(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nhập Gemini API Key của bạn</h2>
                <p className="text-gray-600 mb-6">
                    Để sử dụng ứng dụng, bạn cần cung cấp Gemini API Key. Key của bạn sẽ được lưu trữ an toàn trong trình duyệt và không được gửi đi bất cứ đâu khác.
                </p>

                <div className="mb-4">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 sr-only">
                        Gemini API Key
                    </label>
                    <input
                        type="password"
                        id="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Nhập API Key của bạn tại đây"
                        className="block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
                    />
                </div>
                
                <a
                    href="https://www.youtube.com/watch?v=JZCjL3hrvcY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center mb-6"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Xem video hướng dẫn lấy API Key
                </a>

                <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Lưu và Bắt đầu
                </button>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
