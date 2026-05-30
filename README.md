# Copa Rapidin — Do Arraiá pro Gol é Rapidin

Landing page + painel admin para a campanha "Do Arraiá pro Gol é Rapidin", da Rapidin Internet, válida em todas as cidades atendidas pela empresa durante o período promocional.

## Stack

- **Frontend:** Vite + React 19 + TanStack Start + TanStack Router + Tailwind v4 + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + Storage + Realtime)
- **Hospedagem:** Lovable Cloud

## Rotas

- `/` — Landing pública (Hero, Ranking ao vivo, Prêmios, Como Funciona, Galeria, Dúvidas)
- `/participar` — Cadastro público (QR code do estande)
- `/admin` — Painel administrativo (login via Supabase Auth)

## Setup local

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuração Supabase

Projeto: `copa-rapidin` (sa-east-1) — `vsewdexexhvmklczcdko`.

Tabelas: `bairros`, `participantes`, `eventos_pontuacao`, `destaque_do_dia`, `duelo_do_dia`, `galeria`, `banners`, `admins`.

Triggers cuidam de atualizar `pontos_total` automaticamente. RLS bloqueia escrita pública exceto cadastro de participante.

## Criar primeiro admin

1. Cria conta via Supabase Dashboard → Authentication → Users → Add user
2. Roda no SQL editor:
   ```sql
   insert into public.admins (user_id, email)
   values ('<UUID-DO-USER>', '<email>');
   ```
3. Logar em `/admin`.

## Assets

- `public/banner-principal.png` — hero principal
- `public/premios-{primeiro,segundo,terceiro}.png` — cards de prêmio
- `public/assets/mascote/*.png` — 14 variações do mascote 3D
