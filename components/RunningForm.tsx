import React, { useState, useMemo, useEffect } from 'react';
import type { UserInput } from '../types';
import { GOAL_OPTIONS, STATUS_OPTIONS, DURATION_OPTIONS } from '../constants';

interface RunningFormProps {
    onSubmit: (data: UserInput) => void;
    isLoading: boolean;
}

const FormSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-6">{title}</h2>
        {children}
    </div>
);

const FormField: React.FC<{ label: string, htmlFor: string, required?: boolean, children: React.ReactNode }> = ({ label, htmlFor, required, children }) => (
     <div>
        <label htmlFor={htmlFor} className="block text-base font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);


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
    
    const inputStyles = "mt-1 block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                 <FormSection title="1. Mục tiêu & Thời gian">
                     <div className="space-y-6">
                        <FormField label="Mục tiêu cự ly" htmlFor="goal">
                            <select id="goal" name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className={inputStyles}>
                                {GOAL_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Thời gian huấn luyện" htmlFor="trainingDuration">
                            <select id="trainingDuration" name="trainingDuration" value={trainingDuration} onChange={(e) => setTrainingDuration(e.target.value)} className={inputStyles}>
                                {DURATION_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </FormField>

                        {showCustomDurationInput && (
                            <div className="animate-fade-in pl-4 border-l-4 border-blue-500">
                                <FormField label="Nhập tổng thời gian" htmlFor="customTrainingDuration">
                                    <input type="text" id="customTrainingDuration" name="customTrainingDuration" value={customTrainingDuration} onChange={(e) => setCustomTrainingDuration(e.target.value)} placeholder="Ví dụ: 20 tuần, 5 tháng..." className={inputStyles} />
                                </FormField>
                            </div>
                        )}

                        <FormField label="Thời gian hoàn thành mục tiêu (Pace/giờ)" htmlFor="targetTime">
                            <input type="text" id="targetTime" name="targetTime" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} placeholder="Ví dụ: 04:30:00 hoặc Pace 6:15" className={inputStyles} />
                        </FormField>
                     </div>
                 </FormSection>

                 <FormSection title="2. Thông tin cá nhân">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField label="Tuổi" htmlFor="age" required>
                                <input type="number" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="30" className={inputStyles} />
                            </FormField>
                            <FormField label="Giới tính" htmlFor="gender" required>
                                 <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className={inputStyles}>
                                    <option>Nam</option>
                                    <option>Nữ</option>
                                    <option>Khác</option>
                                </select>
                            </FormField>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormField label="Cân nặng (kg)" htmlFor="weight" required>
                                <input type="number" id="weight" name="weight" value={weight} onChange={(e) => setWeight(e.target.value)} required placeholder="70" className={inputStyles}/>
                            </FormField>
                            <FormField label="Chiều cao (cm)" htmlFor="height" required>
                                <input type="number" id="height" name="height" value={height} onChange={(e) => setHeight(e.target.value)} required placeholder="175" className={inputStyles} />
                            </FormField>
                        </div>
                         <FormField label="Số ngày có thể tập/tuần" htmlFor="trainingDays">
                            <select id="trainingDays" name="trainingDays" value={trainingDays} onChange={(e) => setTrainingDays(e.target.value)} className={inputStyles}>
                                <option value="2">2 ngày</option>
                                <option value="3">3 ngày</option>
                                <option value="4">4 ngày</option>
                                <option value="5">5 ngày</option>
                                <option value="6">6 ngày</option>
                            </select>
                        </FormField>
                         <FormField label="VO2 Max (nếu có)" htmlFor="vo2max">
                            <input type="number" id="vo2max" name="vo2max" value={vo2max} onChange={(e) => setVo2max(e.target.value)} placeholder="Chỉ số trên đồng hồ thể thao" className={inputStyles} />
                        </FormField>
                    </div>
                 </FormSection>
            </div>
            
             <FormSection title="3. Tình trạng & Lịch sử chạy bộ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                     <div>
                        <FormField label="Tình trạng chạy bộ hiện tại" htmlFor="status">
                            <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputStyles}>
                                {availableStatusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </FormField>
                        {showCustomDistanceInput && (
                            <div className="animate-fade-in pl-4 border-l-4 border-blue-500 mt-6">
                                <FormField label="Số km chạy được (km)" htmlFor="customDistance">
                                    <input type="number" id="customDistance" name="customDistance" value={customDistance} onChange={(e) => setCustomDistance(e.target.value)} placeholder="Ví dụ: 8" className={inputStyles} />
                                </FormField>
                            </div>
                        )}
                     </div>

                    {showAdvancedInputs && (
                         <div className="space-y-6 animate-fade-in">
                            <FormField label="Link Strava Profile (công khai, nếu có)" htmlFor="stravaProfile">
                                <input type="url" id="stravaProfile" name="stravaProfile" value={stravaProfile} onChange={(e) => setStravaProfile(e.target.value)} placeholder="https://www.strava.com/athletes/your_id" className={inputStyles} />
                            </FormField>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormField label="Pace trung bình (phút/km)" htmlFor="pace">
                                    <input type="text" id="pace" name="pace" value={pace} onChange={(e) => setPace(e.target.value)} placeholder="Ví dụ: 6:30" className={inputStyles} />
                                </FormField>
                                <FormField label="Nhịp tim trung bình (nếu có)" htmlFor="heartRate">
                                    <input type="number" id="heartRate" name="heartRate" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="Ví dụ: 150 bpm" className={inputStyles} />
                                </FormField>
                            </div>
                        </div>
                    )}
                </div>
            </FormSection>

            <div className="pt-8 border-t">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'AI Coach đang xây dựng giáo án...' : 'Tạo giáo án toàn diện'}
                </button>
            </div>
        </form>
    );
};