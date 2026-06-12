# Universo vivo da Mel

O projeto agora tem uma base para crescer com o casal.

## O que foi adicionado

- SQLite para fotos, vídeos, eventos e diário.
- Painel administrativo em `/admin`.
- Upload de fotos e vídeos pelo painel.
- Exclusão de fotos, vídeos, eventos e mensagens.
- Diário do casal com autores `Nicolas` e `Mel`.
- Respostas no diário.
- Calendário inteligente.
- Máquina do tempo por data.
- Bot romântico animado.
- Pedido de notificações do navegador.
- Jogos do universo: quiz, caça ao coração, quebra-cabeça, memória e Cupido.
- Galáxia 3D com estrelas, constelação e planetas.
- Controle de música com tocar/pausar e volume.

## Senha do painel

Senha local padrão:

```text
mel2025
```

Para produção, configure a variável:

```text
ADMIN_PASSWORD
```

## Observação importante sobre Vercel

A Vercel mantém o site online no mesmo link, mas não é ideal para uploads permanentes feitos pelo painel, porque arquivos enviados pelo servidor podem ser perdidos em ambiente serverless.

Para uploads realmente permanentes pelo painel, use uma destas opções:

- Render com disco persistente.
- Um banco/storage externo.
- Atualizar fotos e vídeos pelo GitHub, como já foi feito até agora.

O site continua funcionando na Vercel com as fotos e vídeos que estão no repositório.
