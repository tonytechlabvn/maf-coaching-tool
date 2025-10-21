import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <img 
                src="https://tonytechlab.com/wp-content/uploads/2025/10/maf.jpg" 
                alt="MAF Ho Chi Minh Running Coaching Banner" 
                className="w-full max-w-2xl mx-auto mb-8 rounded-lg shadow-md"
            />
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                MAF HO CHI MINH RUNNING COACHING
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Nhận giáo án chạy bộ tham khảo được cá nhân hóa bởi team MAF Ho Chi Minh. Cung cấp thông tin chi tiết để có kế hoạch tối ưu nhất cho bạn.
            </p>
        </header>
    );
};