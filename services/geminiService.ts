
import { GoogleGenAI, Type } from "@google/genai";
import type { RunningPlan, UserInput } from '../types';
import { BASE_PROMPT } from '../constants';

const planSchema = {
    type: Type.OBJECT,
    properties: {
        isFeasible: {
            type: Type.BOOLEAN,
            description: "Mục tiêu có khả thi và an toàn không? `true` nếu có, `false` nếu không."
        },
        planTitle: {
            type: Type.STRING,
            description: "Tiêu đề của giáo án, ví dụ: 'Giáo án 16 Tuần Chinh Phục Marathon (MAF HR-เป้าหมาย: 150bpm)'"
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Tiêu đề cho phần phân tích, ví dụ 'Phân tích & Đánh giá Hiện trạng'" },
                content: { type: Type.STRING, description: "Nội dung phân tích chi tiết dựa trên dữ liệu người dùng và Strava, tập trung vào độ bền tích lũy và BMI." }
            },
            required: ["title", "content"]
        },
        trainingSchedule: {
            type: Type.ARRAY,
            description: "Một mảng chứa kế hoạch chi tiết cho từng tuần.",
            items: {
                type: Type.OBJECT,
                properties: {
                    week: { type: Type.NUMBER, description: "Số thứ tự của tuần, ví dụ: 1" },
                    focus: { type: Type.STRING, description: "Trọng tâm hoặc mục tiêu của tuần đó, ví dụ: 'Xây dựng nền tảng hiếu khí'" },
                    dailyPlan: {
                        type: Type.ARRAY,
                        description: "Kế hoạch chi tiết cho 7 ngày trong tuần.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING, description: "Ngày trong tuần, ví dụ: 'Thứ Hai'" },
                                activity: { type: Type.STRING, description: "Hoạt động của ngày đó, ví dụ: 'Nghỉ ngơi' hoặc 'Chạy nhẹ 45 phút (giữ nhịp tim dưới 150bpm)'." },
                            },
                            required: ["day", "activity"]
                        }
                    }
                },
                required: ["week", "focus", "dailyPlan"]
            }
        },
        expertTip: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Tiêu đề cho lời khuyên, ví dụ 'Lời khuyên chuyên gia MAF' hoặc 'Cảnh báo Rủi ro!'" },
                content: { type: Type.STRING, description: "Nội dung lời khuyên hoặc cảnh báo quan trọng nếu kế hoạch không khả thi." }
            },
            required: ["title", "content"]
        },
        supplementaryExercises: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Tiêu đề cho phần bổ trợ, ví dụ 'Bài tập bổ trợ đề xuất'" },
                content: { type: Type.STRING, description: "Nội dung mô tả các bài tập bổ trợ, ví dụ: '1. Plank: 3 hiệp, mỗi hiệp 30 giây. 2. Squat: 3 hiệp, mỗi hiệp 15 lần.'" }
            },
            required: ["title", "content"]
        },
        nutritionGuide: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Tiêu đề cho phần dinh dưỡng, ví dụ 'Hướng dẫn dinh dưỡng cơ bản'" },
                content: { type: Type.STRING, description: "Nội dung chi tiết về dinh dưỡng cho runner trong tuần." }
            },
            required: ["title", "content"]
        },
        disclaimer: {
            type: Type.STRING,
            description: "Lời từ chối trách nhiệm chuẩn: 'Lưu ý: Đây là giáo án tham khảo. Hãy lắng nghe cơ thể và tham khảo ý kiến y tế nếu cần.'"
        },
    },
    required: ["isFeasible", "planTitle", "expertTip", "disclaimer"]
};

const buildStatusDescription = (userInput: UserInput): string => {
    let description = "";
    switch (userInput.status) {
        case 'new':
            description = "Chưa từng tập luyện.";
            break;
        case '5k':
            description = "Đã chạy liên tục được 5km.";
            break;
        case '10k':
            description = "Đã chạy liên tục được 10km.";
            break;
        case '21k':
            description = "Đã chạy liên tục được 21km.";
            break;
        case '42k':
            description = "Đã chạy liên tục được 42km.";
            break;
        case 'custom':
            if (userInput.customDistance) {
                description = `Có thể chạy liên tục ${userInput.customDistance}km.`;
            } else {
                 description = "Có kinh nghiệm chạy bộ nhưng không chọn cự ly cụ thể.";
            }
            break;
        default:
            description = "Không có thông tin.";
    }

    if (userInput.pace && userInput.status !== 'new') {
        description += ` Pace trung bình khoảng ${userInput.pace}/km.`;
    }

    if (userInput.heartRate && userInput.status !== 'new') {
        description += ` Với nhịp tim trung bình khoảng ${userInput.heartRate} bpm.`;
    }

    return description;
}

const calculateBMI = (weight: string, height: string): string => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);

    if (isNaN(weightKg) || isNaN(heightCm) || heightCm <= 0 || weightKg <= 0) {
        return 'Không cung cấp đủ dữ liệu';
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(2);
};


export const generatePlan = async (userInput: UserInput, apiKey: string): Promise<RunningPlan> => {
    if (!apiKey) {
        throw new Error("API key is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    try {
        const statusDescription = buildStatusDescription(userInput);
        const bmi = calculateBMI(userInput.weight, userInput.height);
        
        let trainingDurationText = '';
        if (userInput.trainingDuration === 'custom') {
            trainingDurationText = userInput.customTrainingDuration || 'Không xác định';
        } else if(userInput.trainingDuration === '12') {
             trainingDurationText = '1 năm';
        }
        else {
            trainingDurationText = `${userInput.trainingDuration} tháng`;
        }

        const prompt = BASE_PROMPT
            .replace('{{muc_tieu}}', userInput.goal)
            .replace('{{thoi_gian_muc_tieu}}', userInput.targetTime || 'Không đặt mục tiêu thời gian cụ thể')
            .replace('{{tong_thoi_gian_huan_luyen}}', trainingDurationText)
            .replace('{{so_ngay_tap}}', userInput.trainingDays)
            .replace('{{tuoi_sinh_hoc}}', userInput.age)
            .replace('{{gioi_tinh}}', userInput.gender)
            .replace('{{chieu_cao}}', userInput.height || 'Không cung cấp')
            .replace('{{can_nang}}', userInput.weight || 'Không cung cấp')
            .replace('{{bmi}}', bmi)
            .replace('{{vo2_max}}', userInput.vo2max || 'Không cung cấp')
            .replace('{{tinh_trang}}', statusDescription)
            .replace('{{strava_profile}}', userInput.stravaProfile || 'Không cung cấp');

        const response = await ai.models.generateContent({
            model: userInput.model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: planSchema,
                temperature: 0.6,
            },
        });
        
        const jsonText = response.text.trim();
        const planData: RunningPlan = JSON.parse(jsonText);
        
        // Ensure nested objects are not null for feasible plans, which can happen if AI deviates.
        // This prevents rendering errors.
        if (planData.isFeasible) {
            planData.analysis = planData.analysis || { title: 'Phân tích', content: 'Không có dữ liệu.' };
            planData.trainingSchedule = planData.trainingSchedule || [];
            planData.supplementaryExercises = planData.supplementaryExercises || { title: 'Bài tập bổ trợ', content: 'Không có dữ liệu.' };
            planData.nutritionGuide = planData.nutritionGuide || { title: 'Dinh dưỡng', content: 'Không có dữ liệu.' };
        }
        
        return planData;

    } catch (error) {
        console.error("Error generating plan from Gemini:", error);
        if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID'))) {
            throw new Error("API key not valid. Please check your key.");
        }
        throw new Error("Failed to generate running plan.");
    }
};