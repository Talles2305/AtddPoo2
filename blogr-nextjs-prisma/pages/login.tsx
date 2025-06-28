import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Salva dados no localStorage ou Context API - para exemplo simples, localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('reference', data.reference);
      localStorage.setItem('bonus', data.bonus.toString());
      localStorage.setItem('referencesCount', data.referencesCount.toString());

      router.push('/account');
    } else {
      setMessage(data.error || 'Erro no login');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        /><br /><br />

        <label>Senha:</label><br />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        /><br /><br />

        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}
