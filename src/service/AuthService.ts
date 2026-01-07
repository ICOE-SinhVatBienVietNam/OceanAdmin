import { toast } from "react-toastify";
import api from "../config/gateway";
import { toastConfig } from "../config/toastConfig";
import { AdminData, setAdminData, setAuth } from "../redux/reducer/adminReducer";
import { store } from "../redux/store";
import axios from "axios";

export class AuthService {

    // Authentication
    static async auth(signal?: AbortSignal) {
        try {
            const { data, status } = await api.get("/auth/me", { signal })

            if (status === 200 || status === 201) {
                const adminData = data as AdminData['user']
                store.dispatch(setAdminData({ adminData }))
                store.dispatch(setAuth({ auth: true }))

                return true
            }

            store.dispatch(setAdminData({ adminData: null }))
            store.dispatch(setAuth({ auth: false }))

            return false
        } catch (error: any) {
            if (axios.isCancel(error)) {
                console.log('Auth request canceled:', error.message);
                return true
            } else {
                store.dispatch(setAdminData({ adminData: null }))
                store.dispatch(setAuth({ auth: false }))
                return false
            }
        }
    }

    // Sign in
    static async signin(email: string, password: string) {
        if (!email || !password) {
            toastConfig({
                toastType: 'error',
                toastMessage: 'Vui lòng điền đầy đủ thông tin'
            })
            return false
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email || !regex.test(email)) {
            toastConfig({
                toastType: 'error',
                toastMessage: 'Email không hợp lệ'
            })
            return false
        }

        let pending

        try {
            pending = toastConfig({
                pending: true,
                toastMessage: "Đang đăng nhập"
            })
            const { data, status } = await api.post("/auth/sign-in", { email, password })
            toast.dismiss(pending)

            if (status === 200 || status === 201) {
                const adminData = data as AdminData

                if (adminData.user.banned) {
                    toastConfig({
                        toastType: 'error',
                        toastMessage: 'Tài khoản đã bị khóa'
                    })

                    setTimeout(() => {
                        toastConfig({
                            toastType: 'info',
                            toastMessage: 'Vui lòng liên hệ quản trị viên'
                        })
                    }, 1000)

                    return false
                } else {
                    toastConfig({
                        toastType: 'success',
                        toastMessage: 'Đăng nhập thành công'
                    })

                    localStorage.setItem("accessToken", adminData.accessToken)
                    localStorage.setItem("refreshToken", adminData.refreshToken)
                    localStorage.setItem("expires_at", adminData.expires_at.toString())

                    store.dispatch(setAdminData({ adminData: adminData.user }))
                    store.dispatch(setAuth({ auth: true }))
                    return true
                }
            }

            toastConfig({
                toastType: 'error',
                toastMessage: 'Tài khoản không hợp lệ'
            })

            return false
        } catch (error) {
            toast.dismiss(pending)
            console.error(error)
            toastConfig({
                toastType: 'error',
                toastMessage: 'Tài khoản không hợp lệ'
            })

            return false
        }
    }
}