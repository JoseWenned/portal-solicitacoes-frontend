import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './presentation/context/AuthProvider';
import PortalLayout from './presentation/components/PortalLayout';
import AuthPage from './presentation/pages/AuthPage';
import DashboardPage from './presentation/pages/DashboardPage';
import SolicitacoesPage from './presentation/pages/SolicitacoesPage';
import SolicitacaoFormPage from './presentation/pages/SolicitacaoFormPage';
import SolicitacaoDetalhePage from './presentation/pages/SolicitacaoDetalhePage';
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
            <Route element={<PortalLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/solicitacoes" element={<SolicitacoesPage />} />
              <Route
                path="/solicitacoes/nova"
                element={<SolicitacaoFormPage key="nova" />}
              />
              <Route
                path="/solicitacoes/:id"
                element={<SolicitacaoDetalhePage />}
              />
              <Route
                path="/solicitacoes/:id/editar"
                element={<SolicitacaoFormPage key="editar" />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}