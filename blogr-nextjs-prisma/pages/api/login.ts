import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Preencha email e senha' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Esta combinação de e-mail e senha está incorreta!' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Esta combinação de e-mail e senha está incorreta!' });

    // Calcula número de referências e bônus
    const referencesCount = await prisma.user.count({ where: { referredBy: user.reference } });
    const bonus = referencesCount * 5;

    return res.status(200).json({
      userId: user.id,
      reference: user.reference,
      bonus,
      referencesCount,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
