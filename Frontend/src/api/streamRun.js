import { API_URL } from '../config.js';

// One SSE block looks like: "data: {...json...}". Join multi-line data and parse it.
function parseBlock(block) {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trimStart())
    .join('\n');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// EventSource only supports GET, so we read the POST response stream ourselves.
export async function streamRun(topic, { onEvent, signal }) {
  const res = await fetch(`${API_URL}/api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ topic }),
    signal,
  });

  if (!res.ok) {
    let message = `The backend returned status ${res.status}.`;
    try {
      const body = await res.json();
      if (typeof body.detail === 'string') message = body.detail;
      else if (Array.isArray(body.detail)) message = body.detail.map((d) => d.msg).join(' ');
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop();
    for (const block of blocks) {
      const event = parseBlock(block);
      if (event) onEvent(event);
    }
  }

  const last = parseBlock(buffer);
  if (last) onEvent(last);
}
