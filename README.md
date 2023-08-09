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

  <pre><code>git clone https://github.com/PaduaDEV/nodejsback.git</code></pre>

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
<h2>GET Pessoa</h2>
<pre><code>
{
    "codigoPessoa": 12,
    "nome": "Pedro",
    "sobrenome": "Paulo",
    "idade": 21,
    "login": "PP.dois",
    "senha": "sen12345678ha",
    "status": 1,
    "enderecos": [
        {
            "codigoEndereco": 15,
            "codigoPessoa": 12,
            "codigoBairro": 1,
            "nomeRua": "RUA CRIADA",
            "numero": "123",
            "complemento": "MINHA CASA UM",
            "cep": "11111-678",
            "bairro": {
                "codigoBairro": 1,
                "codigoMunicipio": 82,
                "nome": "Adriana Parque",
                "status": 1,
                "municipio": {
                    "codigoMunicipio": 82,
                    "codigoUF": 9,
                    "nome": "Anápolis",
                    "status": 1,
                    "uf": {
                        "codigoUF": 9,
                        "sigla": "GO",
                        "nome": "Goiás",
                        "status": 1
                    }
                }
            }
        },
        {
            "codigoEndereco": 13,
            "codigoPessoa": 12,
            "codigoBairro": 3,
            "nomeRua": "RUA C",
            "numero": "456",
            "complemento": "MINHA CASA TRÊS",
            "cep": "33333-680",
            "bairro": {
                "codigoBairro": 3,
                "codigoMunicipio": 82,
                "nome": "Alvorada",
                "status": 1,
                "municipio": {
                    "codigoMunicipio": 82,
                    "codigoUF": 9,
                    "nome": "Anápolis",
                    "status": 1,
                    "uf": {
                        "codigoUF": 9,
                        "sigla": "GO",
                        "nome": "Goiás",
                        "status": 1
                    }
                }
            }
        },
        {
            "codigoEndereco": 12,
            "codigoPessoa": 12,
            "codigoBairro": 2,
            "nomeRua": "ALTERADA",
            "numero": "456",
            "complemento": "MINHA CASA DOIS",
            "cep": "22222-680",
            "bairro": {
                "codigoBairro": 2,
                "codigoMunicipio": 82,
                "nome": "Alto da Bela Vista",
                "status": 1,
                "municipio": {
                    "codigoMunicipio": 82,
                    "codigoUF": 9,
                    "nome": "Anápolis",
                    "status": 1,
                    "uf": {
                        "codigoUF": 9,
                        "sigla": "GO",
                        "nome": "Goiás",
                        "status": 1
                    }
                }
            }
        }
    ]
}
  <h2>PUT /enderecos/{codigoEndereco}</h2>
<p>Atualiza um endereço existente.</p>
<pre><code>
{
    "nomeRua": "Nova Rua",
    "numero": "456",
    "complemento": "Apto 123",
    "cep": "22222-680",
    "codigoBairro": 2
}
</code></pre>

<h2>DELETE /enderecos/{codigoEndereco}</h2>
<p>Exclui um endereço.</p>

<h2>PUT /pessoas/{codigoPessoa}</h2>
<p>Atualiza os detalhes de uma pessoa existente.</p>
<pre><code>
{
    "nome": "Novo Nome",
    "sobrenome": "Novo Sobrenome",
    "idade": 25,
    "login": "novo.login",
    "senha": "novaSenha123"
}
</code></pre>

<h2>DELETE /pessoas/{codigoPessoa}</h2>
<p>Exclui uma pessoa e seus respectivos endereços.</p>
</code></pre>


<h2>Desenvolvedor</h2>
<p>Este projeto foi desenvolvido por Arthur Pádua.</p>
<p>Para mais informações sobre o desenvolvedor e outros projetos, visite:</p>
<ul>
  <li>GitHub: <a href="https://github.com/PaduaDEV">https://github.com/PaduaDEV</a></li>
  <li>LinkedIn: <a href="https://www.linkedin.com/in/arthur-p%C3%A1dua-611479246/">https://www.linkedin.com/in/arthur-p%C3%A1dua-611479246/</a></li>
</ul>



</body>
</html>

