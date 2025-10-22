import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <img 
                src="https://tonytechlab.com/wp-content/uploads/2025/10/maf.jpg" 
                alt="MAF Ho Chi Minh Running Coaching Banner" 
                className="w-full h-60 sm:h-72 object-cover rounded-2xl shadow-lg mb-10"
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                MAF HO CHI MINH RUNNING COACHING
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">
                Nhận giáo án chạy bộ tham khảo được cá nhân hóa bởi team MAF Ho Chi Minh. Cung cấp thông tin chi tiết để có kế hoạch tối ưu nhất cho bạn.
            </p>
        </header>
    );
};