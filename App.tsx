import React, { useState, useCallback } from 'react';
import { RunningForm } from './components/RunningForm';
import { PlanDisplay } from './components/PlanDisplay';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';
import { generatePlan } from './services/geminiService';
import type { RunningPlan, UserInput } from './types';

const App: React.FC = () => {
    const [plan, setPlan] = useState<RunningPlan | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = useCallback(async (userInput: UserInput) => {
        setIsLoading(true);
        setError(null);
        setPlan(null);
        try {
            const newPlan = await generatePlan(userInput);
            setPlan(newPlan);
        } catch (err) {
            console.error(err);
            setError('Đã xảy ra lỗi khi tạo giáo án. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, []);

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