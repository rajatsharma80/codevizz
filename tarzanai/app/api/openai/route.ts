// app/api/openai/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { input, type } = await req.json();

  let prompt = '';

  switch (type) {
    case 'Flowchart':
      prompt = `You are a senior software architect with 10+ years of experience designing complex systems.
Generate a detailed Mermaid.js flowchart for the following scenario: ${input}

Requirements:
- Include all major decision points with clear Yes/No branches
- Show error handling and alternative flows, not just the happy path
- Include validation steps, retry logic, and edge cases where applicable
- Use descriptive labels on nodes and edges (not just "Yes"/"No" — e.g. "Valid credentials?", "Retry < 3?")
- Group related steps logically using subgraphs where it improves clarity
- Cover the full end-to-end flow from trigger to completion

Return ONLY the raw Mermaid.js flowchart syntax. No explanation, no markdown code fences, no comments.`;
      break;

    case 'Sequence Diagram':
      prompt = `You are a senior software architect with 10+ years of experience designing distributed systems.
Generate a detailed Mermaid.js sequence diagram for the following scenario: ${input}

Requirements:
- Include all actors/participants involved (client, services, databases, external APIs, etc.)
- Show both the request and response for every interaction
- Include authentication/authorization steps where relevant
- Show error responses and how they propagate back to the caller
- Include async flows with appropriate notes where relevant
- Add notes to clarify non-obvious steps or important business rules

Return ONLY the raw Mermaid.js sequence diagram syntax. No explanation, no markdown code fences, no comments.`;
      break;

    case 'Java code':
      prompt = `You are a senior Java engineer with 10+ years of experience.
Generate production-quality Java code for the following: ${input}

Requirements:
- Follow SOLID principles and standard design patterns where appropriate
- Include proper exception handling with meaningful error messages
- Add input validation
- Use meaningful variable and method names
- Include Javadoc comments for public methods and classes
- Use Java 17+ features where applicable (records, sealed classes, etc.)

Return only the Java code, no explanation.`;
      break;

    case 'JUnit':
      prompt = `You are a senior Java engineer with 10+ years of experience in test-driven development.
Generate comprehensive JUnit 5 tests for the following: ${input}

Requirements:
- Cover the happy path, edge cases, and error/exception scenarios
- Use @ParameterizedTest with @MethodSource or @CsvSource for data-driven cases
- Use Mockito for mocking dependencies where needed
- Include assertions with meaningful failure messages using assertAll where appropriate
- Use @DisplayName annotations for readable test descriptions
- Follow the Arrange-Act-Assert pattern with clear section comments

Return only the test code, no explanation.`;
      break;

    case 'HTML code':
      prompt = `You are a senior frontend engineer with 10+ years of experience.
Generate clean, semantic HTML for the following: ${input}

Requirements:
- Use semantic HTML5 elements (header, main, section, article, nav, etc.)
- Include ARIA attributes for accessibility
- Add inline CSS for basic styling to make it visually presentable
- Ensure it is responsive with a mobile-first approach
- Include placeholder content that reflects the real use case

Return only the HTML code, no explanation.`;
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
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000
    })
  });

  const data = await response.json();
  return NextResponse.json({ output: data.choices[0].message.content });
}
