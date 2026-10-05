import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  cadastroSchema,
  loginSchema,
} from '../../application/validation/authSchemas';
import { mensagemErro } from '../../infrastructure/http/clients';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ cadastro = false }) {
  const auth = useAuth();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastro ? cadastroSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  if (auth.status === 'loading') {
    return <main className="loading-page">Verificando sessão…</main>;
  }

  if (auth.status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  async function enviar(dados) {
    setErro('');
    setSucesso('');

    try {
      if (cadastro) {
        await auth.cadastrar(dados);
        reset();
        setSucesso('Cadastro realizado. Agora entre com seu e-mail e senha.');
      } else {
        await auth.login(dados);
      }
    } catch (error) {
      setErro(mensagemErro(error));
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand" to="/login">Portal de Solicitações</Link>
        <span className="eyebrow">Organize suas demandas</span>

        <h1>{cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
        <p>
          {cadastro
            ? 'Cadastre-se para registrar e acompanhar solicitações.'
            : 'Entre para acompanhar suas solicitações internas.'}
        </p>

        {erro && <div className="alert error" role="alert">{erro}</div>}
        {sucesso && <div className="alert success" role="status">{sucesso}</div>}

        <form onSubmit={handleSubmit(enviar)} noValidate>
          {cadastro && (
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name')}
              />
              {errors.name && (
                <small id="name-error">{errors.name.message}</small>
              )}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <small id="email-error">{errors.email.message}</small>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete={cadastro ? 'new-password' : 'current-password'}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {errors.password && (
              <small id="password-error">{errors.password.message}</small>
            )}
          </div>

          <button className="button primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Aguarde…'
              : cadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          {cadastro ? 'Já possui uma conta? ' : 'Ainda não possui conta? '}
          <Link to={cadastro ? '/login' : '/cadastro'}>
            {cadastro ? 'Entrar' : 'Cadastre-se'}
          </Link>
        </p>
      </section>
    </main>
  );
}