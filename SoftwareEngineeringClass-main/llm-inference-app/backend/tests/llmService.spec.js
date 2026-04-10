// Set timeout for LLM tests that call Ollama (can be slow)
if (typeof jasmine !== 'undefined') {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
}

const LlmService = require('../src/services/llmService');

describe('LLM Service', () => {
  it('should return a non-empty reply for a normal prompt', async () => {
    const reply = await LlmService.generateReply('Explain REST APIs simply.');
    expect(typeof reply).toBe('string');
    expect(reply.length).toBeGreaterThan(0);
  });

  it('should reference recent thread context when prior user prompts exist', async () => {
    const reply = await LlmService.generateReply('What about the next step?', {
      messages: [
        { role: 'user', content: 'First context message' },
        { role: 'assistant', content: 'Assistant reply' },
        { role: 'user', content: 'Second context message' }
      ]
    });

    expect(reply).toContain('First context message');
    expect(reply).toContain('Second context message');
  });
});
