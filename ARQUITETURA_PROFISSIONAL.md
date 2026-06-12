# Arquitetura Profissional - Universo Digital do Casal

## Objetivo

Construir um universo digital vivo para Nicolas e Mel, com prioridade absoluta para celular. O site principal é o Universo Atual. O aniversário da Mel continua preservado como memória histórica separada, acessada pelo calendário em `02/06/2026`.

## Experiências

### 1. Universo Digital do Casal

Experiência principal, viva e atual. Ela contém galáxia, cronômetro em tempo real, diário, mural, áudio, filme, mapa, livro, cápsula do tempo, conquistas, bot Mimi, constelações, Planeta Mel, presentes, flores, jogos e painel administrativo.

### 2. Memória Histórica do Aniversário

Experiência congelada no tempo, separada em `/memorias/aniversario-mel`. Mantém bolo, quiz, mensagem, fotos e vídeos daquele capítulo, com botão para voltar ao presente.

## Jornada emocional

1. A Mel entra e vê uma galáxia viva com Nicolas e Mel.
2. Ela toca em Entrar e o universo se abre com música e movimento.
3. Ela percebe a data e hora reais, vendo que o site entende o dia atual.
4. Ela encontra constelações com os nomes MEL, NICOLAS e um coração.
5. Ela toca no Planeta Mel e recebe uma mensagem de princesa.
6. Ela passa por fotos, mural, mapa, vídeos e filme do relacionamento.
7. Ela joga, desbloqueia conquistas e encontra presentes escondidos.
8. Ela lê o livro da história e cria cartas futuras na cápsula do tempo.
9. Ela abre a cartinha interativa e recebe a mensagem final.
10. Datas especiais mudam o clima do universo sem misturar a página histórica.

## Mobile first

O celular é a prioridade. As seções usam:

- grids que viram uma coluna em telas pequenas;
- botões grandes;
- navegação horizontal fixa;
- cards com 8px de borda;
- mídia com lazy loading;
- listas paginadas ou limitadas;
- renderização progressiva para evitar travamentos.

No desktop, os mesmos componentes ganham mais colunas, mais respiro e painéis lado a lado.

## Estrutura de pastas

```text
love-project/
├── app.py
├── requirements.txt
├── vercel.json
├── ARQUITETURA_PROFISSIONAL.md
├── UNIVERSO_VIVO.md
├── templates/
│   ├── index.html
│   ├── birthday.html
│   └── admin.html
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    ├── img/
    ├── music/
    ├── audio/
    ├── thumbs/
    └── videos/
```

## Banco de dados

SQLite local e `/tmp` na Vercel. Tabelas principais:

- `photos`: fotos da galeria.
- `videos`: vídeos.
- `events`: eventos do calendário.
- `diary`: mensagens do diário.
- `audio_messages`: mensagens de voz.
- `memory_mural`: mural com foto, local, data e descrição.
- `story_chapters`: capítulos do livro.
- `time_capsules`: cartas futuras.
- `profiles`: perfis Nicolas e Mel.
- `site_settings`: personalização do site.

## Rotas Flask

- `GET /`: Universo Atual.
- `GET /memorias/aniversario-mel`: memória histórica.
- `GET /admin`: painel.
- `POST /profile`: selecionar perfil.
- `POST /diary`: criar mensagem no diário.
- `POST /time-capsule`: criar carta futura.
- `POST /admin/photo`: adicionar foto.
- `POST /admin/video`: adicionar vídeo.
- `POST /admin/audio`: adicionar áudio.
- `POST /admin/mural`: adicionar memória no mural.
- `POST /admin/event`: adicionar evento.
- `POST /admin/chapter`: adicionar capítulo.
- `POST /admin/settings`: alterar personalização.
- `GET /admin/backup/export`: exportar backup JSON.
- `POST /admin/backup/restore`: restaurar backup JSON.
- `POST /admin/delete/<kind>/<id>`: excluir itens.

## Tempo real

O navegador usa o relógio real do dispositivo da Mel:

- data atual;
- hora, minuto e segundo;
- modo dia/noite;
- cronômetro desde `14/11/2025`;
- eventos automáticos do dia;
- calendário abrindo no mês atual.

O servidor envia eventos cadastrados; o cliente decide o que está acontecendo hoje.

## Performance

Para suportar 500 fotos, 100 vídeos e 1000 mensagens:

- imagens usam `loading="lazy"`;
- vídeos usam `preload="metadata"`;
- listas principais mostram quantidades limitadas por vez;
- botões carregam mais itens sem travar;
- uploads geram miniaturas quando Pillow estiver disponível;
- vídeos recebem preview com o próprio arquivo como metadata/poster quando não houver ferramenta externa.

## Personalização

O painel permite alterar:

- música principal;
- cores;
- textos de entrada;
- fotos;
- vídeos;
- áudios;
- eventos;
- capítulos;
- cápsulas;
- perfis.

Tudo sem editar código.
