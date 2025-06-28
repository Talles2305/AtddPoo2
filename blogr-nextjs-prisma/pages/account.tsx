import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Account() {
  const router = useRouter();
  const [reference, setReference] = useState('');
  const [bonus, setBonus] = useState(0);
  const [referencesCount, setReferencesCount] = useState(0);

  useEffect(() => {
    // Pega dados do usuário do localStorage
    const storedReference = localStorage.getItem('reference');
    const storedBonus = localStorage.getItem('bonus');
    const storedRefs = localStorage.getItem('referencesCount');

    if (!storedReference) {
      // Se não tiver login, redireciona para login
      router.push('/login');
      return;
    }

    setReference(storedReference);
    setBonus(storedBonus ? Number(storedBonus) : 0);
    setReferencesCount(storedRefs ? Number(storedRefs) : 0);
  }, [router]);

  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Minha Conta</h1>
      <p><strong>Número de referências:</strong> {referencesCount}</p>
      <p><strong>Bônus recebido:</strong> R$ {bonus.toFixed(2)}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
