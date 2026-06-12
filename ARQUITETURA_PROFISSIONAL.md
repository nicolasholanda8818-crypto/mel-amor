# Arquitetura Profissional - Universo Digital da Mel

## Objetivo

Construir um universo digital vivo para Nicolas e Mel, com prioridade absoluta para celular. A experiência principal é simples de usar, organizada e leve. O site de aniversário da Mel continua preservado como memória histórica separada, acessada pelo calendário em `02/06/2026`.

O projeto também funciona como plataforma compartilhada: conteúdos cadastrados por Nicolas, Mel, Eduardo ou futuros usuários autorizados ficam disponíveis para todos.

## Regra de experiências

### 1. Universo Digital do Casal

É a experiência atual e principal. Ela abre primeiro e concentra apenas as áreas realmente úteis:

- `🌌 Início`
- `📸 Galeria`
- `🎥 Vídeos`
- `📖 Diário`
- `📅 Calendário`
- `🎮 Jogos`
- `💌 Cartas`
- `⚙️ Painel`

A funcionalidade de locais foi removida da interface, incluindo pins e geolocalização.

### 2. Memória Histórica do Aniversário

Fica separada em `/memorias/aniversario-mel`. Ela preserva bolo, mensagem, fotos, vídeos e visual daquele capítulo. O calendário funciona como máquina do tempo para acessar essa memória.

## Jornada emocional

1. A Mel entra e vê a galáxia viva com Nicolas e Mel.
2. Ela toca em Entrar, a música começa e o universo abre.
3. No Início, ela vê data, hora, cronômetro do relacionamento, frase romântica e foto do dia.
4. Ela navega por uma galeria única com todas as fotos.
5. Ela abre a biblioteca única de vídeos.
6. Ela escreve ou lê mensagens no diário, identificadas por Nicolas ou Mel.
7. Ela usa o calendário para voltar a datas especiais.
8. Ela joga Quiz do Casal, Memória dos Momentos e Cupido do Universo.
9. Ela abre a cartinha interativa e recebe a mensagem final.
10. O painel permite atualizar tudo por botões, sem editar código.

## Mobile first

O celular é a prioridade. As telas usam:

- navegação horizontal curta;
- botões grandes;
- cards com 8px de borda;
- imagens em miniatura;
- vídeos com `preload="metadata"`;
- grids que viram uma coluna;
- listas limitadas para manter desempenho.

No desktop, os mesmos componentes ganham mais colunas sem mudar o fluxo principal.

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

SQLite local e `/tmp` na Vercel. Tabelas ativas:

- `photos`: fotos da galeria única.
- `videos`: vídeos da biblioteca única.
- `music_tracks`: músicas da playlist.
- `events`: datas do calendário.
- `diary`: mensagens do diário.
- `profiles`: perfis Nicolas e Mel.
- `favorites`: favoritos por usuário e tipo de conteúdo.
- `site_settings`: cores, textos e tema.

Tabelas antigas como `audio_messages`, `memory_mural` e `story_chapters` são mantidas para compatibilidade de backup. `time_capsules` é usada como cartas salvas.

## Persistência permanente

Localmente, o projeto usa SQLite e arquivos dentro de `static/`. Para produção permanente, o código aceita:

- `DATABASE_URL` ou `POSTGRES_URL`: banco PostgreSQL real para conteúdos, mensagens, eventos, favoritos, perfis e configurações.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: armazenamento persistente de fotos, vídeos e músicas.

Sem essas variáveis, a Vercel usa armazenamento temporário para uploads. Com elas, não é necessário editar código nem republicar para adicionar conteúdo pelo painel.

## Rotas Flask

- `GET /`: Universo Atual.
- `GET /memorias/aniversario-mel`: memória histórica.
- `GET /admin`: painel simples.
- `POST /profile`: selecionar perfil.
- `POST /diary`: criar mensagem no diário.
- `POST /admin/diary/<id>/edit`: editar mensagem do diário.
- `POST /admin/photo`: adicionar foto.
- `POST /admin/video`: adicionar vídeo.
- `POST /admin/music`: adicionar música.
- `POST /admin/profile`: adicionar usuário autorizado.
- `POST /favorite`: favoritar/desfavoritar conteúdo.
- `POST /admin/event`: adicionar data no calendário.
- `POST /admin/settings`: alterar tema, cores e textos.
- `GET /admin/backup/export`: exportar backup JSON.
- `POST /admin/backup/restore`: restaurar backup JSON.
- `POST /admin/delete/<kind>/<id>`: excluir itens.

## Tempo real

O navegador usa o relógio real do dispositivo:

- data atual;
- hora, minuto e segundo;
- modo dia/noite;
- cronômetro desde `14/11/2025`;
- eventos automáticos;
- calendário abrindo no mês atual;
- foto do dia escolhida automaticamente.

## Performance

Para suportar 500 fotos, 100 vídeos e 1000 mensagens:

- fotos usam miniaturas e `loading="lazy"`;
- vídeos usam `preload="metadata"`;
- o servidor limita a renderização principal a 500 fotos, 100 vídeos e 1000 mensagens;
- uploads de imagem são otimizados com Pillow quando disponível;
- o painel mantém ações simples e separadas.

## Personalização

O painel permite alterar sem código:

- tema entre Galáxia Romântica, Jardim do Amor e Noite dos Sonhos;
- cores principais;
- textos;
- fotos;
- vídeos;
- músicas da playlist;
- cartas;
- mensagens;
- datas do calendário;
- perfis;
- backup JSON.
