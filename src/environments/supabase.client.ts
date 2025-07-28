import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nnhrvhnxlkkvzizsofqm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaHJ2aG54bGtrdnppenNvZnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2OTA5MTcsImV4cCI6MjA2OTI2NjkxN30.Gr2s8c6mpikCbuntZ74eo3lY7JWP5n1KQXGwNxNL9ko'
export const supabase = createClient(supabaseUrl, supabaseKey)
