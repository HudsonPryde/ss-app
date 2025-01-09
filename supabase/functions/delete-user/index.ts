//deno-lint-ignore-file
//deno-lint-ignore-file no-explicit-any require-await
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2&no-check';

console.log(`Function "user-self-deletion" up and running!`);

Deno.serve(async (req: Request) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('API_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('API_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    // And we can run queries in the context of our authenticated user
    const supabaseAdmin = createClient(
      Deno.env.get('API_URL') ?? '',
      Deno.env.get('API_SERVICE_KEY') ?? ''
    );
    const { data: deletion_data, error: deletion_error } =
      await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deletion_error) throw deletion_error;
    console.log('User & files deleted user_id: ' + user.id);
    return new Response(JSON.stringify(deletion_data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
