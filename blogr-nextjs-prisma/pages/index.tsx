/*
  Página de cadastro. Permite que novos usuários se cadastrem. 

  @Author TallesCardoso, RafaelRocha, ViniciusAmaral
*/

import { useState } from 'react';
import { useRouter } from 'next/router';

//componente funcional (função da interface com o usuário) no caso representa a tela de cadastro
export default function Onboard() {
  //estados que guardam os valores do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  //estado que indica se uma requisição está em andamento
  const [loading, setLoading] = useState(false);
  //para armazenar mensagens de erro ou sucesso
  const [message, setMessage] = useState<string | null>(null);
  //instancia o router para navegar entre as págs
  const router = useRouter();

  //função para validar a senha
  function isValidPassword(pwd: string) {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pwd);
  }

  //função que lida com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
    setMessage(null);

    //verificar se senha é válida
    if (!isValidPassword(password)) {
      setMessage('Senha deve ter no mínimo 6 caracteres, com pelo menos 1 letra e 1 número.');
      return;
    }

    setLoading(true);

    //faz uma requisição POST para o onboard enviando os dados do formulário como um JSON
    const res = await fetch('/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, referenceCode }),
    });

    const data = await res.json();

    //se o cadastro der certo redireciona para o login
    if (res.ok) {
      router.push('/login');
    } else {
      setMessage(data.error || 'Erro no cadastro');
    }

    setLoading(false);
  };

 return (
    <>  
      <div id="main">
        <h1>Cadastro</h1>
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
