import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'UserId é obrigatório' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { reference: true, bonus: true },
      });
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  } else if (req.method === 'PUT') {
    const { userId, reference, bonus } = req.body;

    if (!userId || !reference || !bonus) {
      return res.status(400).json({ error: 'Campos insuficientes' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { reference, bonus },
      });
      return res.status(200).json({ message: 'Conta atualizada', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end('Método não permitido');
  }
}
