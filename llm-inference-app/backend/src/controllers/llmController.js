const llmService = require("../services/llmService");

exports.getProviders = (req, res) => {
    const providers = llmService.getAvailableProviders();

    res.json({
        providers
    });
};

exports.queryLLM = async (req, res) => {
    try {
        const { provider, prompt } = req.body;

        if (!provider || !prompt) {
            return res.status(400).json({
                error: "Provider and prompt are required"
            });
        }

        const response = await llmService.generateResponse(provider, prompt);

        res.json({
            provider,
            prompt,
            response
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};