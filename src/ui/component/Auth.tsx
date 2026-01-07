import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AuthService } from '../../service/AuthService';
import { routeConfig } from '../../config/routeConfig';
import { store } from '../../redux/store';
import { setAuth } from '../../redux/reducer/adminReducer';

export const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { } = useSelector((state: RootState) => state.adminReducer);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await AuthService.auth();
            if (!isAuthenticated && location.pathname !== routeConfig.login) {
                navigate(routeConfig.login);
            } else if (isAuthenticated && location.pathname === routeConfig.login) {
                navigate(routeConfig.layout.main + routeConfig.database.root)
            }
        };

        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
            store.dispatch(setAuth({ auth: false }))
            if (location.pathname !== routeConfig.login) {
                navigate(routeConfig.login);
            }
        } else {
            checkAuth();
        }
    }, [location.pathname]);

    return null
}