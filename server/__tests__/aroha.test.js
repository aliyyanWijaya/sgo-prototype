// Mock must be declared before any require so Jest's babel transform can hoist it.
jest.mock('@anthropic-ai/sdk');

const Anthropic = require('@anthropic-ai/sdk');
const request = require('supertest');

// mockCreate is shared — server.js captures it inside `new Anthropic()` at load time.
const mockCreate = jest.fn();
Anthropic.mockImplementation(() => ({
  messages: { create: mockCreate },
}));

process.env.ANTHROPIC_API_KEY = 'test-key-not-real';

// Require the app AFTER the mock is configured.
const app = require('../server');

describe('POST /api/aroha-chat', () => {
  const VALID_REPLY = 'Kia ora! Happy to help you today.';

  beforeEach(() => {
    mockCreate.mockResolvedValue({
      content: [{ type: 'text', text: VALID_REPLY }],
    });
  });

  afterEach(() => {
    mockCreate.mockReset();
  });

  it('returns 200 and a reply field for a valid message', async () => {
    const res = await request(app)
      .post('/api/aroha-chat')
      .send({ message: 'Hello Aroha' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reply', VALID_REPLY);
  });

  it('forwards conversation history to the Anthropic API', async () => {
    const history = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello! How can I help?' },
    ];

    await request(app)
      .post('/api/aroha-chat')
      .send({ message: 'What shops are nearby?', conversationHistory: history });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          ...history,
          { role: 'user', content: 'What shops are nearby?' },
        ],
      })
    );
  });

  it('returns 400 when message is missing', async () => {
    const res = await request(app)
      .post('/api/aroha-chat')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when message is blank whitespace', async () => {
    const res = await request(app)
      .post('/api/aroha-chat')
      .send({ message: '   ' });

    expect(res.status).toBe(400);
  });

  it('returns 502 when the Anthropic API call fails', async () => {
    mockCreate.mockRejectedValue(new Error('Network timeout'));

    const res = await request(app)
      .post('/api/aroha-chat')
      .send({ message: 'Hello' });

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error', 'upstream_error');
  });

  it('uses the correct Claude model', async () => {
    await request(app)
      .post('/api/aroha-chat')
      .send({ message: 'Hello' });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'claude-haiku-4-5-20251001' })
    );
  });
});
