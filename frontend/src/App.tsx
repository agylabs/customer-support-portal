import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import Layout from './components/Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const { token } = useAuthStore();
    return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="tickets" element={<TicketListPage />} />
                <Route path="tickets/:id" element={<TicketDetailPage />} />
            </Route>
        </Routes>
    );
}

export default App;
