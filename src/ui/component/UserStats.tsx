import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number, icon: React.ReactNode, unit: string }> = ({ title, value, icon, unit }) => (
    <div className="bg-white p-6 rounded-lg mainShadow flex items-center-safe justify-between">
        <span className='flex flex-col gap-2.5'>
            <h3 className="text-gray-500 font-medium">{title}</h3>
            <p className="text-2xl font-semibold text-gray-800">
                {value}

                <span className='text-sm font-normal'> {unit}</span>
            </p>
        </span>

        <span className=''>
            {icon}
        </span>
    </div>
);

const CardButton: React.FC<{ text: string }> = ({ text }) => (
    <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-600">
        {text} &rarr;
    </a>
);

const RechartsChartCard: React.FC<{ title: string; data: { day: string; count: number }[]; buttonText?: string; dataKey: string; color: string; }> = ({ title, data, buttonText, dataKey, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg mainShadow">
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
    <div className="bg-white p-6 rounded-lg mainShadow">
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
        user: {
            count: "1,250",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-lightGray">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>

        },
        question: {
            count: "8,900",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-lightGray">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>

        },
        contribution: {
            count: "3,450",
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 stroke-lightGray">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
            </svg>

        },
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
                <button className="bg-mainLightBlue cursor-grab text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Quản lý User
                </button>
            </div>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Tổng số người dùng" value={userStats.user.count} icon={userStats.user.icon} unit='người dùng' />
                <StatCard title="Tổng số câu hỏi" value={userStats.question.count} icon={userStats.question.icon} unit='câu hỏi' />
                <StatCard title="Tổng số đóng góp" value={userStats.contribution.count} icon={userStats.contribution.icon} unit='đóng góp' />
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
