/*
  App personalizado do Next. Ele serve como ponto de entrada para todos componentes da pagina.

  @Author TallesCardoso, RafaelRocha, ViniciusAmaral
*/

import { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
