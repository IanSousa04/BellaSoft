
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tkdoixzfovyzpmidkyfk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZG9peHpmb3Z5enBtaWRreWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMTcwMzAsImV4cCI6MjA1Njc5MzAzMH0.r7W98K9G3P12nt8apGnoNk-lathvSp_qD9rUY5sc6cg";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
        