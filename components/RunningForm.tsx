import React, { useState, useMemo, useEffect } from 'react';
import type { UserInput } from '../types';
import { GOAL_OPTIONS, STATUS_OPTIONS, DURATION_OPTIONS } from '../constants';

interface RunningFormProps {
    onSubmit: (data: UserInput) => void;
    isLoading: boolean;
}

export const RunningForm: React.FC<RunningFormProps> = ({ onSubmit, isLoading }) => {
    const [goal, setGoal] = useState<string>(GOAL_OPTIONS[2].value);
    const [age, setAge] = useState<string>('30');
    const [gender, setGender] = useState<string>('Nam');
    const [weight, setWeight] = useState<string>('70');
    const [height, setHeight] = useState<string>('175');
    const [vo2max, setVo2max] = useState<string>('');
    const [status, setStatus] = useState<string>(STATUS_OPTIONS[1].value);
    const [customDistance, setCustomDistance] = useState<string>('');
    const [heartRate, setHeartRate] = useState<string>('');
    const [pace, setPace] = useState<string>('');
    const [trainingDays, setTrainingDays] = useState<string>('4');
    const [targetTime, setTargetTime] = useState<string>('');
    const [trainingDuration, setTrainingDuration] = useState<string>(DURATION_OPTIONS[0].value);
    const [customTrainingDuration, setCustomTrainingDuration] = useState<string>('');
    const [stravaProfile, setStravaProfile] = useState<string>('');

    const availableStatusOptions = useMemo(() => {
        if (stravaProfile.trim() !== '') {
            return STATUS_OPTIONS.filter(option => option.value !== 'new');
        }
        return STATUS_OPTIONS;
    }, [stravaProfile]);

    useEffect(() => {
        if (stravaProfile.trim() !== '' && status === 'new') {
            setStatus(STATUS_OPTIONS[1].value); 
        }
    }, [stravaProfile, status]);

    useEffect(() => {
        if (status === 'new') {
            setStravaProfile('');
        }
    }, [status]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!age || !weight || !height) {
            alert("Vui lòng nhập đầy đủ Tuổi, Cân nặng và Chiều cao.");
            return;
        }
        if (trainingDuration === 'custom' && !customTrainingDuration) {
             alert("Vui lòng nhập tổng thời gian huấn luyện của bạn.");
            return;
        }
        onSubmit({ 
            goal, 
            age, 
            vo2max, 
            status, 
            customDistance, 
            heartRate, 
            pace, 
            trainingDays, 
            targetTime,
            trainingDuration,
            customTrainingDuration,
            stravaProfile,
            weight,
            height,
            gender
        });
    };
    
    const showAdvancedInputs = status !== 'new';
    const showCustomDistanceInput = status === 'custom';
    const showCustomDurationInput = trainingDuration === 'custom';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Column 1 */}
                 <div className="space-y-6">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1">
                            1. Mục tiêu cự ly
                        </label>
                        <select
                            id="goal"
                            name="goal"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                        >
                            {GOAL_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="trainingDuration" className="block text-sm font-medium text-slate-700 mb-1">
                           2. Thời gian huấn luyện
                        </label>
                        <select
                            id="trainingDuration"
                            name="trainingDuration"
                            value={trainingDuration}
                            onChange={(e) => setTrainingDuration(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                        >
                            {DURATION_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {showCustomDurationInput && (
                        <div className="animate-fade-in pl-2 border-l-2 border-blue-500">
                             <label htmlFor="customTrainingDuration" className="block text-sm font-medium text-slate-700 mb-1">
                                Nhập tổng thời gian
                            </label>
                            <input
                                type="text"
                                id="customTrainingDuration"
                                name="customTrainingDuration"
                                value={customTrainingDuration}
                                onChange={(e) => setCustomTrainingDuration(e.target.value)}
                                placeholder="Ví dụ: 20 tuần, 5 tháng..."
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="targetTime" className="block text-sm font-medium text-slate-700 mb-1">
                           3. Thời gian hoàn thành mục tiêu (Pace/giờ)
                        </label>
                        <input
                            type="text"
                            id="targetTime"
                            name="targetTime"
                            value={targetTime}
                            onChange={(e) => setTargetTime(e.target.value)}
                            placeholder="Ví dụ: 04:30:00 hoặc Pace 6:15"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                 </div>

                 {/* Column 2 */}
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                                4. Tuổi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                                placeholder="30"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                                Giới tính <span className="text-red-500">*</span>
                            </label>
                             <select
                                id="gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option>Nam</option>
                                <option>Nữ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1">
                                Cân nặng (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                                placeholder="70"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1">
                                Chiều cao (cm) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                                placeholder="175"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="trainingDays" className="block text-sm font-medium text-slate-700 mb-1">
                           5. Số ngày có thể tập/tuần
                        </label>
                        <select
                            id="trainingDays"
                            name="trainingDays"
                            value={trainingDays}
                            onChange={(e) => setTrainingDays(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                        >
                            <option value="2">2 ngày</option>
                            <option value="3">3 ngày</option>
                            <option value="4">4 ngày</option>
                            <option value="5">5 ngày</option>
                            <option value="6">6 ngày</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="vo2max" className="block text-sm font-medium text-slate-700 mb-1">
                            6. VO2 Max (nếu có)
                        </label>
                        <input
                            type="number"
                            id="vo2max"
                            name="vo2max"
                            value={vo2max}
                            onChange={(e) => setVo2max(e.target.value)}
                            placeholder="Chỉ số trên đồng hồ thể thao"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                 </div>
            </div>
            
             <div className="pt-6 border-t space-y-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                        7. Tình trạng chạy bộ hiện tại
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    >
                        {availableStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {showCustomDistanceInput && (
                <div className="animate-fade-in pl-2 border-l-2 border-blue-500">
                    <label htmlFor="customDistance" className="block text-sm font-medium text-slate-700 mb-1">
                        Số km chạy được (km)
                    </label>
                    <input
                        type="number"
                        id="customDistance"
                        name="customDistance"
                        value={customDistance}
                        onChange={(e) => setCustomDistance(e.target.value)}
                        placeholder="Ví dụ: 8"
                        className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            )}
            
            {showAdvancedInputs && (
                 <div className="space-y-6 animate-fade-in pt-2">
                    <div>
                        <label htmlFor="stravaProfile" className="block text-sm font-medium text-slate-700 mb-1">
                            8. Link Strava Profile (công khai, nếu có)
                        </label>
                        <input
                            type="url"
                            id="stravaProfile"
                            name="stravaProfile"
                            value={stravaProfile}
                            onChange={(e) => setStravaProfile(e.target.value)}
                            placeholder="https://www.strava.com/athletes/your_id"
                            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="pace" className="block text-sm font-medium text-slate-700 mb-1">
                            Pace trung bình (phút/km)
                            </label>
                            <input
                                type="text"
                                id="pace"
                                name="pace"
                                value={pace}
                                onChange={(e) => setPace(e.target.value)}
                                placeholder="Ví dụ: 6:30"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="heartRate" className="block text-sm font-medium text-slate-700 mb-1">
                                Nhịp tim trung bình (nếu có)
                            </label>
                            <input
                                type="number"
                                id="heartRate"
                                name="heartRate"
                                value={heartRate}
                                onChange={(e) => setHeartRate(e.target.value)}
                                placeholder="Ví dụ: 150 bpm"
                                className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="pt-6 border-t">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'AI Coach đang xây dựng giáo án...' : 'Tạo giáo án toàn diện'}
                </button>
            </div>
        </form>
    );
};