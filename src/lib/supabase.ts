import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!url || !key) {
  throw new Error("Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY não configuradas");
}

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Bairro = {
  id: string;
  nome: string;
  pontos_total: number;
  participantes_count: number;
  evolucao: number;
};

export type Participante = {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  bairro_id: string;
  foto_url: string | null;
  pontos_total: number;
  created_at: string;
};

export type DestaqueDoDia = {
  id: string;
  participante_id: string;
  data: string;
  pontos_hoje: number;
  participante?: Participante & { bairro?: Bairro };
};

export type DueloDoDia = {
  id: string;
  bairro_a_id: string;
  bairro_b_id: string;
  data: string;
  bairro_a?: Bairro;
  bairro_b?: Bairro;
};

export type Banner = {
  id: string;
  imagem_url: string;
  link: string | null;
  ordem: number;
  ativo: boolean;
};

export type GaleriaItem = {
  id: string;
  titulo: string | null;
  foto_url: string;
  ordem: number;
};
