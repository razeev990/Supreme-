export const SUPABASE_PROJECT_REF = 'zyqlntdpftowobsrzbgv';
export const SUPABASE_ANON_KEY = 'sb_publishable_DuyB_EEKvMkDk0QFxQykqg_ZXCMzTwo';
export const SUPABASE_REST_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1`;
export const AGORA_APP_ID = '110534b7d9ce4f1ea80f93494d69ffa5';

export const supabaseHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};
