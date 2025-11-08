import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
);

const CardButton: React.FC<{ text: string }> = ({ text }) => (
    <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-600">
        {text} &rarr;
    </a>
);

const RechartsChartCard: React.FC<{ title: string; data: { day: string; count: number }[]; buttonText?: string; dataKey: string; color: string; }> = ({ title, data, buttonText, dataKey, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                {buttonText && <CardButton text={buttonText} />}
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip cursor={{ fill: 'rgba(240, 240, 240, 0.5)' }} />
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const InfoList: React.FC<{ title: string; items: { primary: string; secondary: string }[]; buttonText?: string }> = ({ title, items, buttonText }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {buttonText && <CardButton text={buttonText} />}
        </div>
        <ul className="space-y-3">
            {items.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium">{item.primary}</span>
                    <span className="text-gray-500 text-sm">{item.secondary}</span>
                </li>
            ))}
        </ul>
    </div>
);

const UserStats: React.FC = () => {
    // Dữ liệu giả lập - bạn sẽ thay thế bằng dữ liệu thật từ API
    const userStats = {
        userCount: '1,250',
        questionCount: '8,900',
        contributionCount: '3,450',
    };

    const questionsData = [
        { day: 'T2', count: 120 },
        { day: 'T3', count: 180 },
        { day: 'T4', count: 70 },
        { day: 'T5', count: 250 },
        { day: 'T6', count: 150 },
        { day: 'T7', count: 300 },
        { day: 'CN', count: 220 },
    ];

    const contributionsData = [
        { day: 'T2', count: 50 },
        { day: 'T3', count: 80 },
        { day: 'T4', count: 60 },
        { day: 'T5', count: 120 },
        { day: 'T6', count: 90 },
        { day: 'T7', count: 150 },
        { day: 'CN', count: 110 },
    ];

    const topContributors = [
        { primary: 'Nguyen Van A', secondary: '150 đóng góp' },
        { primary: 'Tran Thi B', secondary: '125 đóng góp' },
        { primary: 'Le Van C', secondary: '110 đóng góp' },
        { primary: 'Pham Thi D', secondary: '95 đóng góp' },
    ];

    const recentActivity = [
        { primary: 'Hoang Van E', secondary: 'đã đăng ký' },
        { primary: 'Dang Thi F', secondary: 'đã đăng ký' },
        { primary: 'Ngo Van G', secondary: 'đã đăng ký' },
        { primary: 'Do Thi H', secondary: 'đã đăng ký' },
    ];

    return (
        <div className="p-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Thống kê Người dùng</h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Quản lý User
                </button>
            </div>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng số người dùng" value={userStats.userCount} />
                <StatCard title="Tổng số câu hỏi" value={userStats.questionCount} />
                <StatCard title="Tổng số đóng góp" value={userStats.contributionCount} />
            </div>

            {/* Detailed View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RechartsChartCard 
                    title="Câu hỏi trong 7 ngày qua" 
                    data={questionsData} 
                    buttonText="Xem tất cả" 
                    dataKey="count"
                    color="#35A8F6"
                />
                <RechartsChartCard 
                    title="Đóng góp 7 ngày qua" 
                    data={contributionsData} 
                    buttonText="Xem tất cả" 
                    dataKey="count"
                    color="#35A8F6"
                />
                <InfoList title="Người đóng góp hàng đầu" items={topContributors} buttonText="Xem tất cả" />
                <InfoList title="Hoạt động gần đây" items={recentActivity} buttonText="Xem tất cả" />
            </div>
        </div>
    );
};

export default UserStats;
