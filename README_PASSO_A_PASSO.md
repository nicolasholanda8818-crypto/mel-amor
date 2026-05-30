# Site de aniversário da Mel - passo a passo completo

Este projeto já está montado com Flask, galáxia 3D, botão de entrada, música, galeria, vídeo, quiz, bolo animado, confetes, corações e mensagem final.

## 1. Onde estão os arquivos

Abra a pasta:

```text
love-project/
├── app.py
├── requirements.txt
├── vercel.json
├── templates/
│   └── index.html
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── img/
    │   ├── foto1.jpg
    │   ├── foto2.jpg
    │   └── foto3.jpg
    ├── music/
    │   └── COLOQUE_A_MUSICA_AQUI.txt
    └── videos/
        └── COLOQUE_O_VIDEO_AQUI.txt
```

## 2. Como abrir no VS Code

1. Clique com o botão esquerdo no menu Iniciar do Windows.
2. Digite `Visual Studio Code`.
3. Clique com o botão esquerdo em `Visual Studio Code`.
4. Quando abrir, clique com o botão esquerdo em `File`.
5. Clique com o botão esquerdo em `Open Folder`.
6. Escolha a pasta `love-project`.
7. Clique com o botão esquerdo em `Select Folder`.

O que deve aparecer na tela: do lado esquerdo, você verá `app.py`, `templates` e `static`.

Erro comum: abrir a pasta errada. Se você não enxergar `app.py`, volte e abra a pasta `love-project`, não a pasta de cima.

## 3. Como instalar Python

1. Entre no site oficial: `https://www.python.org/downloads/`.
2. Clique com o botão esquerdo no botão amarelo de download.
3. Abra o instalador baixado.
4. Antes de clicar em instalar, marque a caixinha `Add Python to PATH`.
5. Clique com o botão esquerdo em `Install Now`.
6. Espere terminar.
7. Clique em `Close`.

Muito importante: marque `Add Python to PATH`. Se esquecer, o comando `python` pode não funcionar no terminal.

## 4. Como abrir o terminal no VS Code

1. Com o VS Code aberto na pasta do projeto, aperte `Ctrl + '`.
2. Se esse atalho não funcionar, clique com o botão esquerdo em `Terminal`.
3. Clique com o botão esquerdo em `New Terminal`.

O que deve aparecer na tela: uma área embaixo do VS Code com uma linha para digitar comandos.

## 5. Como instalar o Flask

No terminal, digite exatamente:

```bash
pip install flask
```

Depois aperte `Enter`.

O que deve aparecer: várias linhas de instalação. No final, deve voltar para uma linha onde você pode digitar outro comando.

Erro comum: aparecer `pip não é reconhecido`. Isso geralmente significa que o Python não foi instalado com `Add Python to PATH`.

## 6. Como rodar o site no computador

No terminal, digite:

```bash
python app.py
```

Depois aperte `Enter`.

O que deve aparecer:

```text
Running on http://127.0.0.1:5000
```

Agora abra o navegador e digite:

```text
http://127.0.0.1:5000
```

O site vai abrir na tela inicial com o nome `Mary Marcelle`.

## 7. Como colocar as fotos

Você precisa colocar as fotos nesta pasta:

```text
static/img/
```

Os nomes precisam ser exatamente:

```text
foto1.jpg
foto2.jpg
foto3.jpg
```

Passo a passo:

1. Escolha 3 fotos da Mel ou de vocês dois.
2. Clique com o botão direito na foto.
3. Clique com o botão esquerdo em `Renomear`.
4. Digite `foto1.jpg`.
5. Faça o mesmo com `foto2.jpg` e `foto3.jpg`.
6. Copie as fotos.
7. Cole dentro de `love-project/static/img`.
8. Quando o Windows perguntar se deseja substituir, clique em `Substituir`.

Se a foto estiver em PNG:

1. Clique com o botão direito na imagem.
2. Clique em `Abrir com`.
3. Clique em `Paint`.
4. No Paint, clique em `Arquivo`.
5. Clique em `Salvar como`.
6. Escolha `Imagem JPEG`.
7. Salve com o nome correto.

## 8. Como colocar o vídeo

O vídeo precisa ficar nesta pasta:

```text
static/videos/
```

O nome precisa ser exatamente:

```text
video1.mp4
```

Passo a passo:

1. Pegue o vídeo que você quer usar.
2. Renomeie para `video1.mp4`.
3. Copie o arquivo.
4. Cole dentro de `love-project/static/videos`.

Se o vídeo ficar pesado, use o programa HandBrake:

1. Abra o HandBrake.
2. Clique em `File`.
3. Escolha o vídeo.
4. Em preset, escolha `Fast 1080p30`.
5. Clique em `Start Encode`.
6. Use o vídeo novo gerado.

## 9. Como colocar a música

A música precisa ficar nesta pasta:

```text
static/music/
```

O nome precisa ser exatamente:

```text
musica.mp3
```

Passo a passo:

1. Escolha uma música em MP3.
2. Renomeie para `musica.mp3`.
3. Copie o arquivo.
4. Cole dentro de `love-project/static/music`.

Importante: a música começa somente depois que a pessoa clica em `Entrar`. Isso é normal, porque navegadores bloqueiam música automática antes do clique.

## 10. Como testar tudo

1. Rode `python app.py`.
2. Abra `http://127.0.0.1:5000`.
3. Clique com o botão esquerdo em `Entrar`.
4. Veja se a galáxia aparece.
5. Veja se a música toca.
6. Role a página.
7. Confira a galeria.
8. Dê play no vídeo.
9. Clique em `Morro Branco` no quiz.
10. Clique em `Assoprar vela 🎂`.

## 11. Erros comuns

### Flask not found

Digite:

```bash
pip install flask
```

Depois rode de novo:

```bash
python app.py
```

### Address already in use

Isso significa que a porta `5000` já está ocupada.

Abra o arquivo `app.py` e troque:

```python
app.run(debug=True, port=5000)
```

por:

```python
app.run(debug=True, port=5001)
```

Depois abra:

```text
http://127.0.0.1:5001
```

### Imagem não aparece

Confira se o nome está exatamente assim:

```text
foto1.jpg
foto2.jpg
foto3.jpg
```

Não pode ser `foto1.jpeg`, `Foto1.jpg` ou `foto1 (1).jpg`.

### Música não toca

Confira se o arquivo está exatamente aqui:

```text
static/music/musica.mp3
```

Depois clique em `Entrar`, porque a música só começa após esse clique.

### Galáxia não aparece

O site usa Three.js pela internet. Confira se o computador está conectado à internet.

Se ainda não aparecer:

1. Aperte `F12`.
2. Clique em `Console`.
3. Veja se aparece algum erro vermelho.

## 12. Como publicar no GitHub

1. Entre em `https://github.com`.
2. Crie uma conta ou faça login.
3. Clique no botão `+` no canto superior direito.
4. Clique em `New repository`.
5. No nome, digite `love-project`.
6. Clique em `Create repository`.
7. Siga as instruções do GitHub para enviar os arquivos.

## 13. Como publicar na Vercel

1. Entre em `https://vercel.com`.
2. Faça login com GitHub.
3. Clique em `Add New`.
4. Clique em `Project`.
5. Escolha o repositório `love-project`.
6. Clique em `Import`.
7. Clique em `Deploy`.
8. Espere a Vercel terminar.

Quando terminar, ela vai mostrar um link. Esse é o link que você pode mandar para a Mel.

## 14. O que já está pronto

- Tela inicial cinematográfica.
- Botão `Entrar ❤`.
- Música iniciando após clique.
- Galáxia 3D com Three.js.
- Corações 3D flutuando.
- Galeria com 3 fotos.
- Efeito polaroid.
- Carrossel automático.
- Player de vídeo.
- Quiz com resposta `Morro Branco`.
- Chuva de corações.
- Bolo animado com vela.
- Botão `Assoprar vela 🎂`.
- Confetes.
- Mensagem final emocionante.
- Design responsivo para celular.
