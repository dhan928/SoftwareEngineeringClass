const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

function ensureDb() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], conversations: [] }, null, 2));
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

class FileStore {
  static async findUserByEmail(email) {
    const db = readDb();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findUserById(userId) {
    const db = readDb();
    return db.users.find((u) => u.user_id === userId) || null;
  }

  static async createUser({ email, password_hash }) {
    const db = readDb();
    const user = { user_id: uuidv4(), email, password_hash, created_at: new Date().toISOString() };
    db.users.push(user);
    writeDb(db);
    return user;
  }

  static async createConversation(userId, title) {
    const db = readDb();
    const now = new Date().toISOString();
    const conversation = {
      conversation_id: uuidv4(),
      user_id: userId,
      title,
      created_at: now,
      updated_at: now,
      messages: []
    };
    db.conversations.unshift(conversation);
    writeDb(db);
    return conversation;
  }

  static async listConversations(userId, { search = '' } = {}) {
    const db = readDb();
    const query = search.trim().toLowerCase();
    let conversations = db.conversations.filter((c) => c.user_id === userId);
    if (query) {
      conversations = conversations.filter((c) => {
        const haystack = [c.title, ...c.messages.map((m) => m.content)].join(' ').toLowerCase();
        return haystack.includes(query);
      });
    }
    return conversations
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .map((c) => ({
        conversationId: c.conversation_id,
        title: c.title,
        preview: c.messages[0]?.content || '',
        messageCount: c.messages.length,
        createdAt: c.created_at,
        updatedAt: c.updated_at
      }));
  }

  static async getConversation(userId, conversationId) {
    const db = readDb();
    return db.conversations.find((c) => c.user_id === userId && c.conversation_id === conversationId) || null;
  }

  static async appendMessage(userId, conversationId, message) {
    const db = readDb();
    const conversation = db.conversations.find((c) => c.user_id === userId && c.conversation_id === conversationId);
    if (!conversation) throw new Error('Conversation not found');
    conversation.messages.push({
      message_id: uuidv4(),
      role: message.role,
      content: message.content,
      created_at: new Date().toISOString()
    });
    if (!conversation.title || conversation.title === 'New Chat') {
      const firstUser = conversation.messages.find((m) => m.role === 'user');
      if (firstUser) conversation.title = firstUser.content.slice(0, 50).trim() || 'New Chat';
    }
    conversation.updated_at = new Date().toISOString();
    writeDb(db);
    return conversation;
  }

  static async deleteConversation(userId, conversationId) {
    const db = readDb();
    const original = db.conversations.length;
    db.conversations = db.conversations.filter((c) => !(c.user_id === userId && c.conversation_id === conversationId));
    if (db.conversations.length === original) throw new Error('Conversation not found');
    writeDb(db);
  }
}

module.exports = FileStore;
