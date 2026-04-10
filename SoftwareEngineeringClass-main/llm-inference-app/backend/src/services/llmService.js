const axios = require('axios');
const config = require('../config/config');

class LlmService {
  /**
   * Generate a reply using Ollama
   * @param {string} prompt - The user's prompt
   * @param {object} conversation - The conversation object with message history
   * @returns {Promise<string>} - The AI response
   */
  static async generateReply(prompt, conversation = null) {
    try {
      // Build message history for context
      const messageHistory = this.buildMessageHistory(prompt, conversation);

      console.log(`[LLM Service] Calling Ollama at ${config.ollama.baseUrl}`);
      console.log(`[LLM Service] Model: ${config.ollama.model}`);

      // Call Ollama API
      const response = await axios.post(
        `${config.ollama.baseUrl}/api/generate`,
        {
          model: config.ollama.model,
          prompt: messageHistory,
          stream: false,
          temperature: config.ollama.temperature,
          top_p: config.ollama.topP,
          top_k: config.ollama.topK,
          num_predict: config.ollama.numPredict
        },
        {
          timeout: config.ollama.timeout,
          maxContentLength: 1024 * 1024 * 10, // 10MB max response
          timeoutErrorMessage: 'Ollama API call timeout',
          httpAgent: require('http').globalAgent,
          httpsAgent: require('https').globalAgent
        }
      );

      if (!response.data.response) {
        throw new Error('No response from Ollama');
      }

      return response.data.response.trim();
    } catch (error) {
      console.error('[LLM Service] Error:', error.message);

      // Fallback response if Ollama is unavailable
      if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
        console.warn('[LLM Service] Ollama not available, using fallback response');
        return this.generateFallbackReply(prompt, conversation);
      }

      throw error;
    }
  }

  /**
   * Build a formatted message history for the LLM
   */
  static buildMessageHistory(currentPrompt, conversation = null) {
    let history = 'You are a helpful AI assistant. Answer questions clearly and concisely.\n\n';

    // Add previous conversation messages if available
    if (conversation && conversation.messages && conversation.messages.length > 0) {
      // Get last few messages for context (avoid token limit)
      const recentMessages = conversation.messages.slice(-8); // Keep last 8 messages

      for (const message of recentMessages) {
        if (message.role === 'user') {
          history += `User: ${message.content}\n`;
        } else if (message.role === 'assistant') {
          history += `Assistant: ${message.content}\n`;
        }
      }
    }

    // Add current prompt
    history += `User: ${currentPrompt}\nAssistant:`;
    return history;
  }

  /**
   * Generate a fallback response when Ollama is unavailable
   */
  static generateFallbackReply(prompt, conversation = null) {
    const trimmed = (prompt || '').trim();
    const lower = trimmed.toLowerCase();

    let response;

    if (/\bhello\b|\bhi\b|\bhey\b/.test(lower)) {
      response = 'Hello! I\'m ready to help. Unfortunately, the LLM service (Ollama) appears to be unavailable. I\'m using a basic response generator as a fallback. Please ask me a question and I\'ll do my best to help!';
    } else if (lower.includes('what') || lower.includes('who') || lower.includes('when') || lower.includes('where')) {
      response = `I noticed you asked a question: "${trimmed}"\n\nNote: The AI inference service is currently unavailable. In normal operation, I would provide a detailed answer using Ollama. Please ensure Ollama is running on the system and try again.`;
    } else {
      response = `You said: "${trimmed}"\n\nI'm operating in fallback mode because Ollama is not currently available. Make sure you have Ollama installed and running on your system.`;
    }

    return response;
  }
}

module.exports = LlmService;
