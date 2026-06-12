# Universo Digital do Casal

O projeto agora possui duas experiências separadas.

## Experiência principal

O site abre primeiro no Universo Digital do Casal. Esta é a versão atual, viva e em crescimento.

Ela mantém:

- galáxia 3D;
- música;
- cronômetro do relacionamento;
- galeria moderna;
- vídeos separados das fotos;
- calendário inteligente;
- diário do casal;
- bot romântico;
- jogos;
- coração interativo;
- constelações personalizadas;
- Planeta Mel;
- mural de memórias;
- mensagem em áudio;
- rosas e presentes escondidos;
- conquistas;
- transições espaciais;
- mapa do amor;
- filme do relacionamento;
- livro digital;
- cápsula do tempo;
- cartinha interativa;
- eventos automáticos para datas especiais;
- painel administrativo em `/admin`.

## Memória histórica

O aniversário da Mel foi preservado como um capítulo da linha do tempo.

Ele fica em:

```text
/memorias/aniversario-mel
```

No calendário, a data `02/06/2026` leva para essa memória histórica. Lá ficam o visual de aniversário, a mensagem, o bolo, o quiz, fotos, vídeos e o botão:

```text
✨ Voltar ao Presente
```

## Painel administrativo

O painel em `/admin` abre direto, sem pedir senha, para facilitar a atualização do site.

Por ele é possível adicionar:

- fotos;
- vídeos;
- áudios;
- memórias no mural;
- eventos do calendário;
- capítulos do livro;
- cápsulas do tempo;
- mensagens no diário.

## Observação sobre Vercel

A Vercel mantém o site online no mesmo link. Quando uma mudança é enviada para o GitHub, a Vercel atualiza automaticamente o site.

Para uploads permanentes, o caminho mais seguro continua sendo colocar fotos e vídeos no repositório e enviar para o GitHub, porque arquivos enviados pelo painel podem ser temporários no ambiente serverless da Vercel.
