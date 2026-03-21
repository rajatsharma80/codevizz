import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input, type } = await req.json();

  console.log(input);
  console.log(type); 
   

  let prompt = `Rephrase the following prompt: ${type} ${input} . Ensure that the new version maintains the original meaning but uses different wording, making it sound more natural or formal based on the context.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    })
  });

  const data = await response.json();
  return NextResponse.json({ output: data.choices[0].message.content });
}
