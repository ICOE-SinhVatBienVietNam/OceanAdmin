import React, { useState } from "react";
import UserStats from "../component/UserStats";
import HostingStats from "../component/HostingStats";
import DatabaseStats from "../component/DatabaseStats";
import UnderDevelopment from "../component/UnderDevelopment";

type ViewType = 'users' | 'hosting' | 'database';

const Overview: React.FC = () => {
    const [activeView, setActiveView] = useState<ViewType>('users');

    const renderView = () => {
        switch (activeView) {
            case 'users':
                return <UserStats />;
            case 'hosting':
                return <HostingStats />;
            case 'database':
                return <DatabaseStats />;
            default:
                return <UserStats />;
        }
    };

    const NavItem: React.FC<{ view: ViewType; label: string }> = ({ view, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                activeView === view
                    ? 'bg-mainLightBlue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}>
            {label}
        </button>
    );

    return (
        <div className="relative h-full w-full">
            <UnderDevelopment />
            <div className="h-full w-full bg-gray-50 flex">
                <div className="w-60 h-full bg-white border-r border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan</h2>
                    <nav className="flex flex-col space-y-2">
                        <NavItem view="users" label="Người dùng" />
                        <NavItem view="hosting" label="Dịch vụ lưu trữ" />
                        <NavItem view="database" label="Cơ sở dữ liệu" />
                    </nav>
                </div>

                <div className="flex-1 h-full overflow-y-auto">
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

export default Overview;