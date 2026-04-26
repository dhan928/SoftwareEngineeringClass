const express = require('express');
const LlmService = require('../services/llmService');
const router = express.Router();

router.get('/', async (req, res) => {
  const ollamaModels = await LlmService.listOllamaModels();

  const publicModels = [
    { id: 'gpt-3.5-turbo',           name: 'GPT-3.5 Turbo',    provider: 'openai',    local: false },
    { id: 'gpt-4o',                   name: 'GPT-4o',           provider: 'openai',    local: false },
    { id: 'gemini-1.5-flash',         name: 'Gemini 1.5 Flash', provider: 'gemini',    local: false },
    { id: 'gemini-1.5-pro',           name: 'Gemini 1.5 Pro',   provider: 'gemini',    local: false },
    { id: 'claude-3-haiku-20240307',  name: 'Claude 3 Haiku',   provider: 'anthropic', local: false },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet',  provider: 'anthropic', local: false }
  ];

  res.json({ success: true, data: { local: ollamaModels, public: publicModels } });
});

module.exports = router;
