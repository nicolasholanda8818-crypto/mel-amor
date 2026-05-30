# Como deixar o site online

Objetivo: transformar o site local `http://127.0.0.1:5000` em um link online para enviar para a Mel.

## Passo 1 - Criar conta no GitHub

1. Abra o navegador.
2. Digite `https://github.com`.
3. Clique com o botão esquerdo em `Sign up`.
4. Crie sua conta.
5. Confirme o e-mail se o GitHub pedir.

## Passo 2 - Criar repositório

1. No GitHub, clique no botão `+` no canto superior direito.
2. Clique em `New repository`.
3. Em `Repository name`, digite:

```text
love-project
```

4. Deixe como `Public` ou `Private`.
5. Clique em `Create repository`.

## Passo 3 - Enviar o projeto

Você precisa enviar a pasta `love-project` inteira.

Arquivos importantes que já estão prontos:

```text
app.py
requirements.txt
vercel.json
templates/index.html
static/css/style.css
static/js/script.js
static/img/
static/music/
static/videos/
```

Não apague `requirements.txt` e `vercel.json`, porque eles ajudam a Vercel a publicar o site.

## Passo 4 - Criar conta na Vercel

1. Abra `https://vercel.com`.
2. Clique em `Sign Up`.
3. Escolha entrar com GitHub.
4. Autorize a Vercel a acessar sua conta do GitHub.

## Passo 5 - Importar o projeto

1. Na Vercel, clique em `Add New`.
2. Clique em `Project`.
3. Procure o repositório `love-project`.
4. Clique em `Import`.

## Passo 6 - Fazer deploy

1. Confira se a Vercel encontrou o projeto.
2. Não precisa mexer em configurações avançadas.
3. Clique em `Deploy`.
4. Espere carregar até aparecer uma tela de sucesso.

## Passo 7 - Copiar e enviar o link

Quando terminar, a Vercel vai mostrar um link parecido com:

```text
https://love-project.vercel.app
```

1. Clique no link.
2. Confira se o site abriu.
3. Copie o link.
4. Envie para a Mel.

## Se algo der errado

### As fotos não aparecem

Confira se as fotos estão dentro de:

```text
static/img/
```

### O vídeo não aparece

Confira se o vídeo está dentro de:

```text
static/videos/
```

### A música não toca

Confira se a música está dentro de:

```text
static/music/musica.mp3
```

Lembrete: a música só começa depois de clicar em `Entrar`.
