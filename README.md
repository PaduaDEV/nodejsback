<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API de Cadastro de Endereços e Pessoas</title>
</head>

<body>

  <h1>API de Cadastro de Endereços e Pessoas</h1>

  <p>Esta é uma API backend simples para cadastro de endereços (UF, município, bairro) e pessoas (Nome, login e endereço). </code>.</p>

  <h2>Instalação</h2>

  <p>Siga estas etapas para configurar e executar o projeto localmente:</p>

  <ol>
    <li>Certifique-se de ter o Node.js instalado. Você pode baixá-lo em <a href="https://nodejs.org/" target="_blank">nodejs.org</a>.</li>
    <li>Clone este repositório para o seu sistema local:</li>
  </ol>

  <pre><code>git clone https://seu-link-do-repositorio.git</code></pre>

  <ol start="3">
    <li>Navegue até o diretório do projeto:</li>
  </ol>

  <pre><code>cd nome-do-diretorio</code></pre>

  <ol start="4">
    <li>Instale as dependências usando o npm:</li>
  </ol>

  <pre><code>npm install</code></pre>

  <h2>Uso</h2>

  <p>Para iniciar o servidor local, execute o seguinte comando no terminal:</p>

  <pre><code>npm run dev</code></pre>

  <p>O servidor será iniciado e estará acessível em <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>.</p>

  <h2>Rotas da API</h2>

  <p>A API oferece as seguintes rotas para manipular o cadastro de endereços e pessoas:</p>

  <ul>
    <li><code>GET /enderecos</code>: Retorna a lista de endereços cadastrados.</li>
    <li><code>POST /enderecos</code>: Cadastra um novo endereço. Envie os detalhes do endereço no corpo da solicitação.</li>
    <li><code>GET /pessoas</code>: Retorna a lista de pessoas cadastradas.</li>
    <li><code>POST /pessoas</code>: Cadastra uma nova pessoa. Envie os detalhes da pessoa no corpo da solicitação.</li>
  </ul>

 <h1>Exemplos de GET e POST</h1>

<h2>GET UF</h2>
<pre><code>
[
    {
        "codigoUF": 27,
        "sigla": "TO",
        "nome": "Tocantins",
        "status": 1
    },
    {
        "codigoUF": 26,
        "sigla": "SP",
        "nome": "Sao Paulo",
        "status": 1
    }
]
</code></pre>

<h2>POST UF</h2>
<pre><code>
{
    "codigoUF": 28,
    "sigla": "DF",
    "nome": "Distrito Federal",
    "status": 1
}
</code></pre>

<h2>GET Município</h2>
<pre><code>
[
    {
        "codigoMunicipio": 96,
        "codigoUF": 9,
        "nome": "Goiatuba",
        "status": 1
    },
    {
        "codigoMunicipio": 95,
        "codigoUF": 9,
        "nome": "Goianolopis",
        "status": 1
    }
]
</code></pre>

<h2>POST Município</h2>
<pre><code>
{
    "codigoMunicipio": 94,
    "codigoUF": 9,
    "nome": "Goialandia",
    "status": 1
}
</code></pre>

<h2>GET Bairro</h2>
<pre><code>
[
    {
        "codigoBairro": 110,
        "codigoMunicipio": 82,
        "nome": "Loteamento Residencial Anavile",
        "status": 2
    },
    {
        "codigoBairro": 109,
        "codigoMunicipio": 82,
        "nome": "Loteamento Residencial Anavile",
        "status": 2
    }
]
</code></pre>

<h2>POST Bairro</h2>
<pre><code>
{
    "codigoBairro": 104,
    "codigoMunicipio": 82,
    "nome": "Loteamento Novo Jundiaí",
    "status": 1
}
</code></pre>

</body>
</html>
