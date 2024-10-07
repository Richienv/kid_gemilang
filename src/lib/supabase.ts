import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ufdjniokpekvggqwxyee.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZGpuaW9rcGVrdmdncXd4eWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxMzExNDQsImV4cCI6MjA0MzcwNzE0NH0.of_XJV0IU_IK55CNzUbFVeEfN91aAxEBl5vabhZuoEw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)