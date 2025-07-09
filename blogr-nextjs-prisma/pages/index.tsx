import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Onboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function isValidPassword(pwd: string) {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pwd);
  }

  const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
    setMessage(null);

    if (!isValidPassword(password)) {
      setMessage('Senha deve ter no mínimo 6 caracteres, com pelo menos 1 letra e 1 número.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, referenceCode }),
    });

    const data = await res.json();

    if (res.ok) {
      // Redirecionar para login após sucesso
      router.push('/login');
    } else {
      setMessage(data.error || 'Erro no cadastro');
    }

    setLoading(false);
  };

 return (
    <>  
      <div id="main">
        <h1>Cadastro (Onboard)</h1>
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

          <label>Código de referência (opcional, 6 caracteres):</label><br />
          <input
            type="text"
            maxLength={6}
            value={referenceCode}
            onChange={e => setReferenceCode(e.target.value.toUpperCase())}
            disabled={loading}
            placeholder="Exemplo: ABC123"
          /><br /><br />

          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </div>
      <style jsx global>{`
        body {
          background-color: rgb(240, 240, 220);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        #main {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          border: 10px;
          border-radius: 10px;
          border-color: black;
          background-color: rgb(158, 158, 161);
          font-weight: bold;
          padding: 20px;
        }

        button {
          width: 100%;
          padding: 10px;
          background-color: #0077cc;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005fa3;
        }

        input {
          width: 90%;
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        form {
          width: 100%;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }
      `}</style>
    </>
  );
}
