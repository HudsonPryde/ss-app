// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts';

serve(async (req) => {
  const { text } = await req.json();
  const apiKey = Deno.env.get('OPENAI_KEY');
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful tutor aiding a student by making study materials.',
      },
      {
        role: 'user',
        content: `Restructure the following text delimited by triple quotes into a question and answer: """${text}"""`,
      },
      {
        role: 'user',
        content:
          'Return your response as a parsable JSON object in the following format: { Q: "[question]", A: "[answer]", ... }.',
      },
    ],
    model: 'gpt-4o-mini',
  });
  // incase the ai adds some garbage as a wrapper strip everything before the first { and after the last }
  let content = completion.choices[0].message.content;
  content = content.substring(
    content.indexOf('{'),
    content.lastIndexOf('}') + 1
  );
  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
