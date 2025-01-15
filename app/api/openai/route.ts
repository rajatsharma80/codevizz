// app/api/openai/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input, type } = await req.json();

  let prompt = '';

  switch (type) {
    case 'HTML code':
      prompt = `Generate HTML code for: ${input}`;
      break;
    case 'JUnit':
      prompt = `Generate JUnit test for: ${input}`;
      break;
    case 'Java code':
      prompt = `Generate Java code for: ${input}`;
      break;
    case 'Flowchart':
        prompt = `Generate a Mermaid.js flowchart diagram for the given prompt. Only give the instructions generate the diagram using mermaid js. 
        Please do not give any description or details as i need to use the response to render flowchart diagram image in my code: ${input}`;
        break;
    case 'Sequence Diagram':
      //prompt = `Create a detailed Mermaid.js sequence diagram for the following scenario: ${input}`;
      prompt = `Generate a Mermaid.js sequence diagram for the given prompt. Only give the instructions generate the diagram using mermaid js. 
      Please do not give any description or details as i need to use the response to render sequence diagram image in my code: ${input}`
      break;
    default:
      prompt = `Invalid type`;
  }
  
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