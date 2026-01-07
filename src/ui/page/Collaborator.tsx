import React, { useState } from 'react';
import UnderDevelopment from '../component/UnderDevelopment';

// --- Type Definitions --- //
type CollaboratorRole = 'Admin' | 'Editor' | 'Viewer';
type CollaboratorStatus = 'Active' | 'Pending' | 'Inactive';

interface Collaborator {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: CollaboratorRole;
    status: CollaboratorStatus;
    lastActive: string;
}

// --- Dữ liệu giả lập (Placeholder Data) --- //
const collaboratorsData: Collaborator[] = [
    { id: 1, name: 'Trần Văn An', email: 'an.tran@example.com', avatar: 'https://i.pravatar.cc/150?u=an.tran@example.com', role: 'Admin', status: 'Active', lastActive: '2 giờ trước' },
    { id: 2, name: 'Lê Thị Bình', email: 'binh.le@example.com', avatar: 'https://i.pravatar.cc/150?u=binh.le@example.com', role: 'Editor', status: 'Active', lastActive: 'Hôm qua' },
    { id: 3, name: 'Phạm Văn Cường', email: 'cuong.pham@example.com', avatar: 'https://i.pravatar.cc/150?u=cuong.pham@example.com', role: 'Viewer', status: 'Pending', lastActive: 'Đã mời 3 ngày trước' },
    { id: 4, name: 'Nguyễn Thị Dung', email: 'dung.nguyen@example.com', avatar: 'https://i.pravatar.cc/150?u=dung.nguyen@example.com', role: 'Editor', status: 'Inactive', lastActive: '2 tuần trước' },
];

// --- Components phụ --- //
const RoleBadge: React.FC<{ role: CollaboratorRole }> = ({ role }) => {
    const colorClasses: Record<CollaboratorRole, string> = { Admin: 'bg-blue-100 text-blue-800', Editor: 'bg-indigo-100 text-indigo-800', Viewer: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[role]}`}>{role}</span>;
};

const StatusBadge: React.FC<{ status: CollaboratorStatus }> = ({ status }) => {
    const colorClasses: Record<CollaboratorStatus, string> = { Active: 'bg-green-100 text-green-800', Pending: 'bg-yellow-100 text-yellow-800', Inactive: 'bg-red-100 text-red-800' };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

// --- Component chính --- //
const Collaborator: React.FC = () => {
    const collaborators = useState<Collaborator[]>(collaboratorsData)[0];
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isSetRoleModalOpen, setIsSetRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState<CollaboratorRole>('Editor');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<CollaboratorRole>('Editor');
    const [filterRole, setFilterRole] = useState<CollaboratorRole | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<CollaboratorStatus | 'All'>('All');

    let filteredCollaborators = collaborators.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterRole !== 'All') {
        filteredCollaborators = filteredCollaborators.filter(c => c.role === filterRole);
    }

    if (filterStatus !== 'All') {
        filteredCollaborators = filteredCollaborators.filter(c => c.status === filterStatus);
    }

    const handleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredCollaborators.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const cancelEditMode = () => {
        setIsEditMode(false);
        setSelectedIds([]);
    };

    const handleRevokeAction = () => {
        if (selectedIds.length === 0) return;
        alert(`Thực hiện "Tước quyền" cho các quản trị viên có ID: ${selectedIds.join(', ')}`);
        cancelEditMode();
    };

    const handleRoleUpdate = () => {
        if (selectedIds.length === 0) return;
        const selectedEmails = collaborators.filter(c => selectedIds.includes(c.id)).map(c => c.email);
        alert(`Cập nhật vai trò thành "${newRole}" cho các quản trị viên: ${selectedEmails.join(', ')}`);
        // Thêm logic cập nhật vai trò ở đây
        setIsSetRoleModalOpen(false);
        cancelEditMode();
    };

    const handleInvite = () => {
        if (!inviteEmail) {
            alert('Vui lòng nhập email.');
            return;
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
            alert('Địa chỉ email không hợp lệ.');
            return;
        }
        
        alert(`Đã gửi lời mời đến ${inviteEmail} với vai trò ${inviteRole}.`);

        // Reset form and close modal
        setInviteEmail('');
        setInviteRole('Editor');
        setIsInviteModalOpen(false);
    };

    const selectedCollaborators = collaborators.filter(c => selectedIds.includes(c.id));

    return (
        <div className="relative h-full w-full">
            <UnderDevelopment />
            <div className="p-8 h-full bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Phân quyền Quản trị</h1>
                    <div className="flex gap-4 items-center">
                        {!isEditMode ? (
                            <>
                                <button onClick={() => setIsEditMode(true)} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300">
                                    Chỉnh sửa quyền
                                </button>
                                <button onClick={() => setIsInviteModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mainShadow transition duration-300">
                                    + Mời Quản trị viên
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-gray-600">{selectedIds.length} đã chọn</span>
                                <button onClick={() => setIsSetRoleModalOpen(true)} disabled={selectedIds.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300">Thiết lập lại vai trò</button>
                                <button onClick={handleRevokeAction} disabled={selectedIds.length === 0} className="disabled:opacity-50 disabled:cursor-not-allowed bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Tước quyền</button>
                                <button onClick={cancelEditMode} className="text-gray-600 hover:text-gray-800 font-bold py-2 px-4 rounded-lg">Hủy</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <div className="w-1/3">
                        <input type="text" placeholder="Tìm kiếm theo tên hoặc email..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            className="border border-gray-300 rounded-lg px-4 py-2"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value as CollaboratorRole | 'All')}
                        >
                            <option value="All">Tất cả vai trò</option>
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                        </select>
                        <select 
                            className="border border-gray-300 rounded-lg px-4 py-2"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as CollaboratorStatus | 'All')}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-lg mainShadow overflow-hidden">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                {isEditMode && (
                                    <th className="p-4 w-12">
                                        <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length > 0 && selectedIds.length === filteredCollaborators.length} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                )}
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Tên</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Vai trò</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-600">Lần cuối hoạt động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCollaborators.map(user => (
                                <tr key={user.id}
                                    onClick={isEditMode ? () => handleSelect(user.id) : undefined}
                                    className={`border-b border-gray-200 ${selectedIds.includes(user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} ${isEditMode ? 'cursor-pointer' : ''}`}>
                                    {isEditMode && (
                                        <td className="p-4">
                                            <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={(e) => { e.stopPropagation(); handleSelect(user.id); }} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                    )}
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><RoleBadge role={user.role} /></td>
                                    <td className="p-4"><StatusBadge status={user.status} /></td>
                                    <td className="p-4 text-sm text-gray-600">{user.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Set Role Modal */}
                {isSetRoleModalOpen && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thiết lập vai trò mới</h2>
                            <p className="text-sm text-gray-600 mb-4">Cập nhật vai trò cho {selectedIds.length} người dùng đã chọn:</p>
                            <div className="max-h-24 overflow-y-auto mb-4 p-2 border border-gray-200 rounded-md bg-gray-50">
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {selectedCollaborators.map(c => (
                                        <li key={c.id}>{c.email}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">Vai trò mới</label>
                                <select 
                                    id="role-select"
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as CollaboratorRole)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={() => setIsSetRoleModalOpen(false)} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300">Hủy</button>
                                <button onClick={handleRoleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Cập nhật vai trò</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invite Collaborator Modal */}
                {isInviteModalOpen && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Mời Quản trị viên mới</h2>
                            <p className="text-sm text-gray-600 mb-4">Gửi lời mời cộng tác đến một thành viên mới qua địa chỉ email.</p>
                            
                            <div className="mb-4">
                                <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                                <input 
                                    type="email"
                                    id="invite-email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="invite-role-select" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                <select 
                                    id="invite-role-select"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as CollaboratorRole)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={() => setIsInviteModalOpen(false)} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300">Hủy</button>
                                <button onClick={handleInvite} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Gửi lời mời</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collaborator;
