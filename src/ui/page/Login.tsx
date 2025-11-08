import React from "react"

// Image
import Pattern from '../../assets/Pattern.png'
import SinhVatBienVN from '../../assets/SinhVatBienVN.png'

const LoginPage: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Logic
    };

    return (
        <div className="relative h-full w-full bg-mainLightBlue">
            <img src={Pattern} className="h-full" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex flex-col gap-2.5 p-10 rounded-xl shadow-2xl w-[500px] max-w-lg">
                <div className="flex flex-col gap-2.5 items-center-safe">
                    <img src={SinhVatBienVN} alt="Sinh Vật Biển Việt Nam Logo" className="mx-auto h-20 w-auto" />
                    <h2 className="text-2xl font-extrabold text-center text-gray-800 capitalize">Quản Trị Viên</h2>
                    <p className="text-csMedium font-medium text-gray">Vui lòng điền đầy đủ thông tin</p>
                </div>

                <form className="flex flex-col gap-y-5" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                            Địa chỉ Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                            placeholder="Nhập mật khẩu của bạn"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition duration-300 ease-in-out hover:scale-105"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
            <div className="absolute bottom-4 right-4 text-white text-sm">
                Copyright © 2025 Bản quyền thuộc về Nhóm Sinh vật biển Việt Nam
            </div>
        </div>
    )
}

export default LoginPage