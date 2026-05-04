require('dotenv').config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OPENAI_API_KEY   = process.env.OPENAI_API_KEY   || '';
const GEMINI_API_KEY   = process.env.GEMINI_API_KEY   || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

class LlmService {
  static buildMessages(prompt, conversation) {
    const history = (conversation?.messages || []).slice(-20);
    const messages = history.map((m) => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: prompt });
    return messages;
  }

  static async callOllama(model, messages) {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false })
    });
    if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.message?.content || data.response || '';
  }

  static async callOpenAI(model, messages) {
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({ model, messages, max_tokens: 1000 })
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  static async callGemini(model, messages) {
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
    if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  static async callAnthropic(model, messages) {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model, max_tokens: 1000, messages })
    });
    if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text || '';
  }

  static async generateReply(prompt, conversation = null, provider = 'ollama', model = 'llama3') {
    const messages = LlmService.buildMessages(prompt, conversation);
    switch (provider) {
      case 'openai':    return LlmService.callOpenAI(model, messages);
      case 'gemini':    return LlmService.callGemini(model, messages);
      case 'anthropic': return LlmService.callAnthropic(model, messages);
      case 'ollama':
      default:          return LlmService.callOllama(model, messages);
    }
  }

  static async listOllamaModels() {
    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map((m) => ({ id: m.name, name: m.name, provider: 'ollama', local: true }));
    } catch {
      return [];
    }
  }
}

module.exports = LlmService;
