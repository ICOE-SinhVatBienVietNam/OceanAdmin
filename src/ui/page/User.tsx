import React from 'react';
import UnderDevelopment from '../component/UnderDevelopment';

const UserPage: React.FC = () => {
    return (
        <div className="relative h-full w-full p-5">
            <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
            <UnderDevelopment />
        </div>
    );
};

export default UserPage;
