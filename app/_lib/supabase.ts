import { createClient } from '@supabase/supabase-js'

// ビルド時に未設定の場合はプレースホルダーで初期化（実際のリクエスト時にエラー）
const supabaseUrl = process.env.SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
