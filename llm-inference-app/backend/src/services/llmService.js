const providers = [
    {
        id: "openai",
        name: "OpenAI GPT",
        type: "public"
    },
    {
        id: "gemini",
        name: "Google Gemini",
        type: "public"
    },
    {
        id: "claude",
        name: "Anthropic Claude",
        type: "public"
    },
    {
        id: "local-small",
        name: "Local Small Model",
        type: "local"
    }
];

function getAvailableProviders() {
    return providers;
}

async function generateResponse(provider, prompt) {
    const validProvider = providers.find((p) => p.id === provider);

    if (!validProvider) {
        throw new Error("Invalid LLM provider selected");
    }

    const lowerPrompt = prompt.toLowerCase();

    // Simple math support
    if (
        lowerPrompt.includes("2 + 2") ||
        lowerPrompt.includes("2+2") ||
        lowerPrompt.includes("what is 2")
    ) {
        return `[Mock ${validProvider.name} Response]: The answer is 4.`;
    }

    // Simple weather support
    if (
        lowerPrompt.includes("weather") ||
        lowerPrompt.includes("temperature") ||
        lowerPrompt.includes("forecast")
    ) {
        return `[Mock ${validProvider.name} Response]: This is a mock weather response. Weather tool integration can be added later with a real weather API.`;
    }

    return `[Mock ${validProvider.name} Response]: You asked: ${prompt}`;
}

module.exports = {
    getAvailableProviders,
    generateResponse
};