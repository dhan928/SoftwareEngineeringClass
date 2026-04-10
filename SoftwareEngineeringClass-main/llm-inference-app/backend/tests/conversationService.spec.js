// Set timeout for Conversation tests that call LLM Service/Ollama
if (typeof jasmine !== 'undefined') {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
}

const fs = require('fs');
const path = require('path');
const ConversationService = require('../src/services/conversationService');
const UserService = require('../src/services/userService');

const dbFile = path.join(__dirname, '..', 'data', 'db.json');

function resetDb() {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  fs.writeFileSync(dbFile, JSON.stringify({ users: [], conversations: [] }, null, 2));
}

describe('Conversation Service', () => {
  let user;

  beforeEach(async () => {
    resetDb();
    user = await UserService.registerUser(`chat_${Date.now()}@example.com`, 'StrongPass123!');
  });

  it('should create a conversation with the initial user and assistant messages', async () => {
    const conversation = await ConversationService.createConversation(
      user.userId,
      'How do I run this project?'
    );

    expect(conversation.conversationId).toBeDefined();
    expect(conversation.title).toContain('How do I run this project');
    expect(conversation.messages.length).toBe(2);
    expect(conversation.messages[0].role).toBe('user');
    expect(conversation.messages[1].role).toBe('assistant');
  });

  it('should retrieve an existing conversation by id', async () => {
    const conversation = await ConversationService.createConversation(
      user.userId,
      'Tell me about iteration 2.'
    );

    const loaded = await ConversationService.getConversation(user.userId, conversation.conversationId);
    expect(loaded.conversationId).toBe(conversation.conversationId);
    expect(loaded.messages.length).toBe(2);
  });

  it('should search conversations by keyword', async () => {
    await ConversationService.createConversation(user.userId, 'How do I search chat history?');
    await ConversationService.createConversation(user.userId, 'Explain database schema design.');

    const results = await ConversationService.listConversations(user.userId, { search: 'history' });
    expect(results.length).toBe(1);
    expect(results[0].title.toLowerCase()).toContain('history');
  });

  it('should append a new message to an existing thread', async () => {
    const conversation = await ConversationService.createConversation(
      user.userId,
      'First prompt in the thread.'
    );

    const result = await ConversationService.sendMessage(
      user.userId,
      conversation.conversationId,
      'Second prompt in the same thread.'
    );

    expect(result.conversation.conversationId).toBe(conversation.conversationId);
    expect(result.conversation.messages.length).toBe(4);
    expect(result.conversation.messages[2].role).toBe('user');
    expect(result.conversation.messages[2].content).toContain('Second prompt');
    expect(result.conversation.messages[3].role).toBe('assistant');
  });

  it('should delete a conversation', async () => {
    const conversation = await ConversationService.createConversation(
      user.userId,
      'Delete this chat later.'
    );

    await ConversationService.deleteConversation(user.userId, conversation.conversationId);

    await expectAsync(
      ConversationService.getConversation(user.userId, conversation.conversationId)
    ).toBeRejectedWithError('Conversation not found');
  });
});
