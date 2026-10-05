import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthProvider';
import AuthPage from './presentation/pages/AuthPage';
import HomePage from './presentation/pages/HomePage';
import ProtectedRoute from './presentation/routes/ProtectedRoute';
import './presentation/styles/global.scss';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage key="login" />} />
          <Route
            path="/cadastro"
            element={<AuthPage key="cadastro" cadastro />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}