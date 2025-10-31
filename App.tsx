import React, { useState, useCallback, useEffect } from 'react';
import { RunningForm } from './components/RunningForm';
import { PlanDisplay } from './components/PlanDisplay';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';
import { ApiKeyModal } from './components/ApiKeyModal';
import { generatePlan } from './services/geminiService';
import type { RunningPlan, UserInput } from './types';

// Extend window interface to include the default key
declare global {
    interface Window {
        DEFAULT_API_KEY?: string;
    }
}

const App: React.FC = () => {
    const [plan, setPlan] = useState<RunningPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);

    useEffect(() => {
        // Priority:
        // 1. Key from localStorage (user's own key)
        // 2. Key from deployment environment (window.DEFAULT_API_KEY)
        const storedKey = localStorage.getItem('gemini_api_key');
        const defaultKey = window.DEFAULT_API_KEY;

        if (storedKey) {
            setApiKey(storedKey);
        } else if (defaultKey && defaultKey !== "" && defaultKey !== "__GEMINI_API_KEY__") {
            setApiKey(defaultKey);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
    };

    const handleGeneratePlan = useCallback(async (userInput: UserInput) => {
        if (!apiKey) {
            setError('API Key is not configured. Please set your API key.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const newPlan = await generatePlan(userInput, apiKey);
            setPlan(newPlan);
        } catch (err) {
            console.error(err);
            if (err instanceof Error && err.message.includes('API key not valid')) {
                 setError('API Key không hợp lệ. Vui lòng kiểm tra lại và nhập key mới.');
                 localStorage.removeItem('gemini_api_key');
                 setApiKey(null); // This will re-trigger the modal
            } else {
                 setError('Đã xảy ra lỗi khi tạo giáo án. Vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);
    
    if (!apiKey) {
        return <ApiKeyModal onSave={handleSaveApiKey} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50">
            <div className="w-full max-w-6xl mx-auto">
                <Header />
                <main className="mt-10">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-200">
                        <RunningForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
                    </div>
                    
                    <div className="mt-10">
                        {isLoading && (
                            <div className="flex justify-center items-center p-12">
                                <Spinner />
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative text-lg" role="alert">
                                <strong className="font-bold">Lỗi! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {plan && !isLoading && (
                            <div className="animate-fade-in">
                                <PlanDisplay plan={plan} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;