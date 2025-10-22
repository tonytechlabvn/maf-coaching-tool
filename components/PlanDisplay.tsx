import React, { useState, useRef } from 'react';
import type { RunningPlan, WeeklyPlan } from '../types';

// Allow TypeScript to recognize html2canvas from the global scope (CDN)
declare const html2canvas: any;

interface PlanDisplayProps {
    plan: RunningPlan;
}

const WeekCard: React.FC<{ weekData: WeeklyPlan }> = ({ weekData }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white h-full shadow-sm">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-800 text-lg">Tuần {weekData.week}</h4>
            <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Trọng tâm:</span> {weekData.focus}
            </p>
        </div>
        <div className="p-4 space-y-3">
            {weekData.dailyPlan.map(dayPlan => {
                const isRestDay = dayPlan.activity.toLowerCase().includes('nghỉ');
                return (
                     <div key={dayPlan.day} className="flex items-start text-sm">
                        <span className={`font-semibold w-20 flex-shrink-0 ${isRestDay ? 'text-gray-500' : 'text-gray-800'}`}>
                            {dayPlan.day}:
                        </span>
                        <span className={`ml-2 ${isRestDay ? 'text-gray-500' : 'text-gray-800'}`}>
                            {dayPlan.activity}
                        </span>
                    </div>
                )
            })}
        </div>
    </div>
);

const FourWeekBlock: React.FC<{ weeks: WeeklyPlan[]; phaseIndex: number }> = ({ weeks, phaseIndex }) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const startWeek = weeks[0].week;
    const endWeek = weeks[weeks.length - 1].week;

    const handleExportImage = async () => {
        if (!printRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(printRef.current, { 
                scale: 2,
                backgroundColor: '#ffffff' // Ensure background is white
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `MAF_giao_an_tuan_${startWeek}-${endWeek}.png`;
            link.href = dataUrl;
            link.click();
        } catch(err) {
            console.error("Failed to export image:", err);
            alert("Đã xảy ra lỗi khi xuất ảnh. Vui lòng thử lại.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg bg-gray-50">
            <div className="p-5 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Giai đoạn {phaseIndex + 1}: Tuần {startWeek} - {endWeek}
                </h3>
                <button 
                    onClick={handleExportImage}
                    disabled={isExporting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {isExporting ? 'Đang xử lý...' : 'Xuất ra ảnh'}
                </button>
            </div>
            <div ref={printRef} className="p-5 bg-white">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                     {weeks.map((week) => (
                        <WeekCard key={week.week} weekData={week} />
                     ))}
                 </div>
            </div>
        </div>
    );
};

function chunkArray<T>(array: T[], size: number): T[][] {
    const chunkedArr: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
}


export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
    const [activeTab, setActiveTab] = useState('analysis');

    const handleDownload = () => {
        if (!plan.trainingSchedule) return;
        const headers = "Tuần,Trọng tâm,Ngày,Hoạt động\n";

        const csvRows = plan.trainingSchedule.map(week => 
            week.dailyPlan.map(day => {
                const weekNum = week.week;
                const focus = `"${week.focus.replace(/"/g, '""')}"`;
                const dayName = `"${day.day.replace(/"/g, '""')}"`;
                const activity = `"${day.activity.replace(/"/g, '""')}"`;
                return [weekNum, focus, dayName, activity].join(',');
            }).join('\n')
        ).join('\n');

        const csvString = headers + csvRows;
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "MAF_Running_Plan.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    if (!plan.isFeasible) {
        return (
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-red-300">
                <div className="bg-red-50 border-l-8 border-red-500 p-8 rounded-r-lg">
                    <h3 className="font-extrabold text-red-800 text-2xl">{plan.expertTip.title}</h3>
                    <p className="mt-4 text-lg text-red-700 font-semibold" style={{ whiteSpace: 'pre-wrap' }}>{plan.expertTip.content}</p>
                </div>
                 <p className="mt-8 text-sm text-center text-gray-500">{plan.disclaimer}</p>
            </div>
        )
    }
    
    const MAX_WEEKS_DISPLAY = 48; // 12 blocks * 4 weeks/block
    const isPlanLong = plan.trainingSchedule && plan.trainingSchedule.length > MAX_WEEKS_DISPLAY;
    const weeksToDisplay = isPlanLong 
        ? plan.trainingSchedule.slice(0, MAX_WEEKS_DISPLAY) 
        : plan.trainingSchedule || [];
    const weeklyChunks = chunkArray(weeksToDisplay, 4);

    const tabs = [
        { id: 'analysis', label: 'Phân tích & Đánh giá' },
        { id: 'schedule', label: 'Lịch tập luyện' },
        { id: 'exercises', label: 'Bài tập bổ trợ' },
        { id: 'nutrition', label: 'Dinh dưỡng khuyến nghị' }
    ];

    return (
        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-200">
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{plan.planTitle}</h2>
            </div>
             
             <div className="bg-amber-50 border-l-8 border-amber-400 p-6 rounded-r-lg mb-8">
                <h3 className="font-bold text-amber-800 text-xl">{plan.expertTip.title}</h3>
                <p className="mt-3 text-base text-amber-900 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{plan.expertTip.content}</p>
            </div>
            
             <div className="flex justify-start mb-8">
                <button 
                    onClick={handleDownload}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Tải giáo án (CSV)
                </button>
            </div>

            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap pb-4 px-1 border-b-2 font-semibold text-base`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8">
                    {activeTab === 'analysis' && plan.analysis && (
                        <div className="bg-blue-50 border-l-8 border-blue-400 p-6 rounded-r-lg animate-fade-in">
                            <h3 className="font-bold text-blue-800 text-xl">{plan.analysis.title}</h3>
                            <p className="mt-3 text-base text-blue-900 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{plan.analysis.content}</p>
                        </div>
                    )}
                    {activeTab === 'exercises' && plan.supplementaryExercises && (
                        <div className="bg-green-50 border-l-8 border-green-400 p-6 rounded-r-lg animate-fade-in">
                            <h3 className="font-bold text-green-800 text-xl">{plan.supplementaryExercises.title}</h3>
                            <p className="mt-3 text-base text-green-900 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{plan.supplementaryExercises.content}</p>
                        </div>
                    )}
                     {activeTab === 'nutrition' && plan.nutritionGuide && (
                        <div className="bg-purple-50 border-l-8 border-purple-400 p-6 rounded-r-lg animate-fade-in">
                            <h3 className="font-bold text-purple-800 text-xl">{plan.nutritionGuide.title}</h3>
                            <p className="mt-3 text-base text-purple-900 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{plan.nutritionGuide.content}</p>
                        </div>
                    )}
                    {activeTab === 'schedule' && plan.trainingSchedule && (
                        <div className="animate-fade-in">
                             {isPlanLong && (
                                <div className="bg-sky-100 border-l-8 border-sky-500 text-sky-800 p-6 mb-8 rounded-r-lg" role="alert">
                                    <p className="font-bold text-lg">Thông báo</p>
                                    <p className="mt-2 text-base">Giáo án của bạn dài hơn 48 tuần. Để xem kế hoạch đầy đủ, vui lòng tải về tệp CSV.</p>
                                </div>
                            )}
                            <div className="space-y-8">
                                {weeklyChunks.map((chunk, index) => (
                                    <FourWeekBlock key={`phase-${index}`} weeks={chunk} phaseIndex={index} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-10 text-sm text-center text-gray-500">{plan.disclaimer}</p>
        </div>
    );
};