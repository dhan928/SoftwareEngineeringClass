const LlmService = require('../src/services/llmService');

describe('LlmService', () => {

  describe('buildMessages', () => {
    it('should build messages with just the prompt when no conversation', () => {
      const messages = LlmService.buildMessages('hello', null);
      expect(messages.length).toBe(1);
      expect(messages[0].role).toBe('user');
      expect(messages[0].content).toBe('hello');
    });

    it('should include conversation history before the new prompt', () => {
      const conversation = {
        messages: [
          { role: 'user', content: 'first message' },
          { role: 'assistant', content: 'first reply' }
        ]
      };
      const messages = LlmService.buildMessages('second message', conversation);
      expect(messages.length).toBe(3);
      expect(messages[0].content).toBe('first message');
      expect(messages[1].content).toBe('first reply');
      expect(messages[2].content).toBe('second message');
    });

    it('should limit history to last 20 messages', () => {
      const manyMessages = Array.from({ length: 25 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `message ${i}`
      }));
      const messages = LlmService.buildMessages('new prompt', { messages: manyMessages });
      expect(messages.length).toBe(21); // 20 history + 1 new
    });

    it('should return empty history for conversation with no messages', () => {
      const messages = LlmService.buildMessages('hi', { messages: [] });
      expect(messages.length).toBe(1);
    });
  });

  describe('listOllamaModels', () => {
    it('should return an array', async () => {
      const models = await LlmService.listOllamaModels();
      expect(Array.isArray(models)).toBe(true);
    });

    it('should return models with required fields if Ollama is running', async () => {
      const models = await LlmService.listOllamaModels();
      if (models.length > 0) {
        expect(models[0].id).toBeDefined();
        expect(models[0].name).toBeDefined();
        expect(models[0].provider).toBe('ollama');
        expect(models[0].local).toBe(true);
      }
    });
  });

  describe('generateReply', () => {
    it('should throw if openai provider is selected with no API key', async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = '';
      await expectAsync(
        LlmService.generateReply('test', null, 'openai', 'gpt-3.5-turbo')
      ).toBeRejectedWithError('OPENAI_API_KEY is not set');
      process.env.OPENAI_API_KEY = originalKey;
    });

    it('should throw if gemini provider is selected with no API key', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = '';
      await expectAsync(
        LlmService.generateReply('test', null, 'gemini', 'gemini-1.5-flash')
      ).toBeRejectedWithError('GEMINI_API_KEY is not set');
      process.env.GEMINI_API_KEY = originalKey;
    });

    it('should throw if anthropic provider is selected with no API key', async () => {
      const originalKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = '';
      await expectAsync(
        LlmService.generateReply('test', null, 'anthropic', 'claude-3-haiku-20240307')
      ).toBeRejectedWithError('ANTHROPIC_API_KEY is not set');
      process.env.ANTHROPIC_API_KEY = originalKey;
    });

    it('should return a string response from ollama', async () => {
      const reply = await LlmService.generateReply('say hello', null, 'ollama', 'llama3');
      expect(typeof reply).toBe('string');
      expect(reply.length).toBeGreaterThan(0);
    }, 30000);
  });

});
