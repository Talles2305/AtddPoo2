/*
  página protegida da conta do usuário que exibe informações armazenadas localmente.

  @Author TallesCardoso, RafaelRocha, ViniciusAmaral
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//componente funcional que representa a tela account
export default function Account() {
  const router = useRouter();
  //Estados para guardar dados do usuário
  const [reference, setReference] = useState('');
  const [bonus, setBonus] = useState(0);
  const [referencesCount, setReferencesCount] = useState(0);

  useEffect(() => {
    // o useEffect pega dados do usuário do localStorage
    const storedReference = localStorage.getItem('reference');
    const storedBonus = localStorage.getItem('bonus');
    const storedRefs = localStorage.getItem('referencesCount');

    if (!storedReference) {
      // Se o código de referência não for encontrado no localstorage, o usuário não está logado e volta o usuário para a tela de login
      router.push('/login');
      return;
    }

    //se for encontrado, seta os estados com os valores do localstorage
    setReference(storedReference);
    setBonus(storedBonus ? Number(storedBonus) : 0);
    setReferencesCount(storedRefs ? Number(storedRefs) : 0);
  }, [router]);

  //limpa os valores do localstorage e retorna para a tela de login
  function logout() {
    localStorage.clear();
    router.push('/login');
  }

  return (
    <><>
      <div id ="main">
        <h1>Minha Conta</h1>
        <p><strong>Número de referências:</strong> {referencesCount}</p>
        <p><strong>Bônus recebido:</strong> R$ {bonus.toFixed(2)}</p>
        <button onClick={logout}>Sair</button>
      </div>
    </><style jsx global>{`
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

      `}</style></>
  );
}
