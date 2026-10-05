import { z } from 'zod';
import { categorias } from '../../domain/solicitacoes/solicitacao';

function textoObrigatorio(limite, nome) {
  return z.string()
    .trim()
    .refine(
      (value) => Array.from(value).length > 0,
      `${nome} é obrigatório.`,
    )
    .refine(
      (value) => Array.from(value).length <= limite,
      `${nome} deve possuir até ${limite} caracteres.`,
    );
}

export const solicitacaoSchema = z.object({
  titulo: textoObrigatorio(150, 'Título'),
  descricao: textoObrigatorio(5000, 'Descrição'),
  categoria: z.enum(categorias, {
    error: 'Selecione uma categoria válida.',
  }),
});