import React from 'react';

// --- Reusable Components (Copied from DatabaseStats for consistency) --- //

const ServiceSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg mainShadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
        ></div>
    </div>
);

const UsageStatWithBar: React.FC<{ label: string; used: number; limit: number; unit: string; }> = ({ label, used, limit, unit }) => {
    const percentage = limit > 0 ? (used / limit) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{`${used.toLocaleString()}${unit}`} / {`${limit.toLocaleString()}${unit}`}</span>
            </div>
            <ProgressBar percentage={percentage} />
        </div>
    );
};

const SimpleStat: React.FC<{ label: string; value: string | React.ReactNode; }> = ({ label, value }) => (
     <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-600 text-sm">{label}</span>
        <span className="font-medium text-gray-800 text-sm">{value}</span>
    </div>
)

// --- Main Component --- //

const HostingStats: React.FC = () => {
    // Placeholder data - you'll replace this with actual API data

    return (
        <div className="p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dịch vụ Lưu trữ (Hosting)</h2>

            <div className="flex flex-col gap-8">

                {/* --- Render Section (Large) --- */}
                <ServiceSection title="Render (Backend)">
                    <p className="text-sm text-gray-500 mb-6">Dữ liệu giả lập. Cần kết nối API của Render để lấy dữ liệu thực tế.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Usage Stats */}
                        <div className="flex flex-col gap-4">
                            <UsageStatWithBar label="Giờ hoạt động" used={450} limit={750} unit="h" />
                            <UsageStatWithBar label="Băng thông" used={2.5} limit={5} unit=" GB" />
                            <UsageStatWithBar label="Phút build" used={270} limit={500} unit=" phút" />
                        </div>
                        {/* Recent Activity */}
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Hoạt động gần đây</h4>
                            <div className="flex flex-col gap-2">
                                <SimpleStat label="Deploy #a1b2c3d" value={<span className='text-green-600'>Success</span>} />
                                <SimpleStat label="Deploy #e4f5g6h" value={<span className='text-green-600'>Success</span>} />
                                <SimpleStat label="Deploy #i7j8k9l" value={<span className='text-red-600'>Failed</span>} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <a 
                            href="https://dashboard.render.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-500 hover:text-blue-600">
                            Quản lý trên Render &rarr;
                        </a>
                    </div>
                </ServiceSection>

                {/* --- Vercel Section (Small) --- */}
                <ServiceSection title="Vercel (Frontend)">
                    <p className="text-sm text-gray-500 mb-4">Vercel không cung cấp API để lấy dữ liệu sử dụng. Dưới đây là các giới hạn của gói Hobby (miễn phí).</p>
                    <div className="flex flex-col gap-2">
                        <SimpleStat label="Bandwidth" value="100 GB/tháng" />
                        <SimpleStat label="Build Time" value="100 Giờ/tháng" />
                        <SimpleStat label="Serverless Functions" value="100 GB-Giờ/tháng" />
                    </div>
                    <div className="mt-6 text-right">
                        <a 
                            href="https://vercel.com/dashboard/usage"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-500 hover:text-blue-600">
                            Xem chi tiết trên Vercel &rarr;
                        </a>
                    </div>
                </ServiceSection>

            </div>
        </div>
    );
};

export default HostingStats;
