const llmService = require("../src/services/llmService");

describe("LLM Service", () => {
    it("should return a list of available LLM providers", () => {
        const providers = llmService.getAvailableProviders();

        expect(providers.length).toBeGreaterThan(0);
        expect(providers[0].id).toBeDefined();
        expect(providers[0].name).toBeDefined();
        expect(providers[0].type).toBeDefined();
    });

    it("should include public LLM providers", () => {
        const providers = llmService.getAvailableProviders();
        const providerIds = providers.map((provider) => provider.id);

        expect(providerIds).toContain("openai");
        expect(providerIds).toContain("gemini");
        expect(providerIds).toContain("claude");
    });

    it("should include a local small model option", () => {
        const providers = llmService.getAvailableProviders();
        const providerIds = providers.map((provider) => provider.id);

        expect(providerIds).toContain("local-small");
    });

    it("should generate a mock response for a valid provider", async () => {
        const response = await llmService.generateResponse(
            "openai",
            "Hello"
        );

        expect(response).toContain("Mock OpenAI GPT Response");
        expect(response).toContain("Hello");
    });

    it("should throw an error for an invalid provider", async () => {
        await expectAsync(
            llmService.generateResponse("fake-provider", "Hello")
        ).toBeRejectedWithError("Invalid LLM provider selected");
    });

    it("should return a mock weather response for a weather question", async () => {
        const response = await llmService.generateResponse(
            "gemini",
            "What is the weather today?"
        );

        expect(response).toContain("mock weather response");
    });
});