import { writeFileSync, mkdirSync } from 'fs';

const TODAY = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  timeZone: 'America/Chicago'
});

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{
      role: "user",
      content: `Today is ${TODAY}. Generate content for ertyz.com. Return ONLY valid JSON, no markdown:
      {
        "date": "${TODAY}",
        "headline": "a compelling headline",
        "intro": "2-3 sentence introduction",
        "article": "3-4 paragraphs on an interesting topic",
        "quote": "an inspiring quote with attribution",
        "fact": "one fascinating fact",
        "timestamp": "${new Date().toISOString()}"
      }`
    }]
  })
});

const data = await response.json();
const content = JSON.parse(data.content[0].text);
mkdirSync('./content', { recursive: true });
writeFileSync('./content/daily.json', JSON.stringify(content, null, 2));
console.log('✅ Done:', content.headline);
