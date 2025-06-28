import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for(let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { email, password, referenceCode } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  // Verificar senha no backend (repetir validação frontend)
  const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!pwdRegex.test(password)) return res.status(400).json({ error: 'Senha inválida' });

  try {
    // Verifica se email já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail já existe!' });
    }

    // Se código referência informado, verificar se existe
    if (referenceCode) {
      const referrer = await prisma.user.findUnique({ where: { reference: referenceCode } });
      if (!referrer) {
        return res.status(400).json({ error: 'Código de referência não existe!' });
      }
    }

    // Gerar código de referência único de 6 chars
    let newReference = '';
    let tries = 0;
    do {
      newReference = generateCode(6);
      const existingCode = await prisma.user.findUnique({ where: { reference: newReference } });
      if (!existingCode) break;
      tries++;
      if (tries > 10) throw new Error('Não foi possível gerar código único');
    } while(true);

    const hashedPassword = await bcrypt.hash(password, 10);

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
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
