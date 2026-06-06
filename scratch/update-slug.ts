import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateSlug() {
  console.log('Starting slug update...')
  
  const { data, error } = await supabase
    .from('administrative_guides')
    .update({ slug: 'engineer-visa-extension' })
    .eq('slug', 'gia-han-visa-ky-su')
    .select();

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Successfully updated slug to engineer-visa-extension!', data?.[0]?.id);
  }
}

updateSlug();
