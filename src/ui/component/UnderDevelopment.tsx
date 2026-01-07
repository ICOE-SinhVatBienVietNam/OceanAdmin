import React from 'react';

const UnderDevelopment: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Chức năng đang được phát triển</h2>
                <p>Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn tính năng này. Vui lòng quay lại sau!</p>
            </div>
        </div>
    );
};

export default UnderDevelopment;
