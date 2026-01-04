import React from 'react';

// --- Reusable Components --- //

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

const SimpleStat: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
     <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
    </div>
)

// --- Main Component --- //

const DatabaseStats: React.FC = () => {
    // Placeholder data - you'll replace this with actual API data

    return (
        <div className="p-8 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cơ sở dữ liệu & Lưu trữ</h2>
            
            <div className="flex flex-col gap-8">

                {/* --- Cloudinary Section (Large) --- */}
                <ServiceSection title="Cloudinary (Lưu trữ ảnh)">
                    <p className="text-sm text-gray-500 mb-6">Dữ liệu giả lập. Cần kết nối API của Cloudinary để lấy dữ liệu thực tế.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <UsageStatWithBar label="Dung lượng lưu trữ" used={15.7} limit={25} unit=" GB" />
                        <UsageStatWithBar label="Băng thông" used={10.2} limit={25} unit=" GB" />
                        <UsageStatWithBar label="Biến đổi ảnh" used={8500} limit={25000} unit="" />
                    </div>
                     <div className="mt-6 text-right">
                        <a 
                            href="https://cloudinary.com/console"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-500 hover:text-blue-600">
                            Quản lý trên Cloudinary &rarr;
                        </a>
                    </div>
                </ServiceSection>

                {/* --- Supabase Section (Small) --- */}
                <ServiceSection title="Supabase (Cơ sở dữ liệu)">
                    <p className="text-sm text-gray-500 mb-6">Dữ liệu giả lập. Cần kết nối API của Supabase để lấy dữ liệu thực tế.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UsageStatWithBar label="Kích thước Database" used={0.25} limit={0.5} unit=" GB" />
                        <UsageStatWithBar label="Dung lượng File Storage" used={0.5} limit={1} unit=" GB" />
                    </div>
                    <div className="mt-4">
                        <SimpleStat label="Lượt gọi API" value="Không giới hạn" />
                        <SimpleStat label="Người dùng hoạt động" value="5,678 / 50,000" />
                    </div>
                     <div className="mt-6 text-right">
                        <a 
                            href="https://app.supabase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-500 hover:text-blue-600">
                            Quản lý trên Supabase &rarr;
                        </a>
                    </div>
                </ServiceSection>

            </div>
        </div>
    );
};

export default DatabaseStats;
