import { z } from 'zod';

const quantidadeCaracteres = (value) => Array.from(value).length;
const quantidadeBytes = (value) => new TextEncoder().encode(value).length;

const email = z.string()
  .trim()
  .toLowerCase()
  .email('Informe um e-mail válido.')
  .max(254, 'O e-mail deve possuir até 254 caracteres.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const cadastroSchema = z.object({
  name: z.string()
    .trim()
    .refine(
      (value) => quantidadeCaracteres(value) >= 3,
      'O nome deve possuir pelo menos 3 caracteres.',
    )
    .refine(
      (value) => quantidadeCaracteres(value) <= 100,
      'O nome deve possuir até 100 caracteres.',
    ),
  email,
  password: z.string()
    .refine(
      (value) => quantidadeCaracteres(value) >= 8,
      'A senha deve possuir pelo menos 8 caracteres.',
    )
    .refine(
      (value) => quantidadeBytes(value) <= 72,
      'A senha deve possuir até 72 bytes em UTF-8.',
    ),
});