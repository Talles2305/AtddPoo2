/*
  Parte de criação de conta de usuário. Cria um novo usuário com email e senha.

  @Author TallesCardoso, RafaelRocha, ViniciusAmaral
*/

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

//função para gerar código de referência aleatório
function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

//rota da api onboard
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API /api/onboard chamada com método:', req.method);

  //try para aceitar apenas requisições POST
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }

    //pega os dados do corpo da requisição
    const { email, password, referenceCode } = req.body;
    console.log('Dados recebidos:', { email, password: password ? '****' : null, referenceCode });

    //valida se os campos obrigatórios foram enviados
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    //valida a senha
    const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!pwdRegex.test(password)) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    // Verifica se o email já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail já existe!' });
    }

    // Verifica o código de referência
    if (referenceCode) {
      const referrer = await prisma.user.findUnique({ where: { reference: referenceCode } });
      if (!referrer) {
        return res.status(400).json({ error: 'Código de referência não existe!' });
      }
    }

    // Gera código de referência único
    let newReference = '';
    let tries = 0;
    do {
      newReference = generateCode(6);
      const existingCode = await prisma.user.findUnique({ where: { reference: newReference } });
      if (!existingCode) break;
      tries++;
      if (tries > 10) throw new Error('Não foi possível gerar código único');
    } while (true);

    //criptografa a senha no bd
    const hashedPassword = await bcrypt.hash(password, 10);

    //cria um novo usuário no bd
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        reference: newReference,
        referredBy: referenceCode || null,
        bonus: 0,
      },
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error: any) {
    console.error('Erro capturado na API /api/onboard:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
