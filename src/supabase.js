import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lfnremondgidezvllxlp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnJlbW9uZGdpZGV6dmxseGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NTUxNTYsImV4cCI6MjEwODUzMTE1Nn0.TM_D5t11V9M6T4R6QatnZb_QSUAPYWu7TPqRMjVwL1c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
