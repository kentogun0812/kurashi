import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRegions() {
  const { data, error } = await supabase.from('regions').select('*').limit(5)
  if (error) {
    console.error('Error fetching regions:', error)
  } else {
    console.log('Regions count:', data?.length)
    console.log('First 5 regions:', JSON.stringify(data, null, 2))
  }
}

checkRegions()
