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

    return `[Mock ${validProvider.name} Response]: You asked: ${prompt}`;
}

module.exports = {
    getAvailableProviders,
    generateResponse
};