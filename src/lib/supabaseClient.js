import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lxhenqinhclkwofedueo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_db39QqZn7sqQm7johW4joQ_pJmxlcX9'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper function to check connection
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('crypto_assets').select('count')
        if (error) throw error
        console.log('✅ Supabase connected successfully')
        return true
    } catch (error) {
        console.error('❌ Supabase connection error:', error.message)
        return false
    }
}
