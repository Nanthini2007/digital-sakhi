/**
 * P0 Backend API Test Suite
 *
 * Run:   node --test backend-api.test.js
 * Needs: Node 18+ (built-in fetch + node:test), backend running on BASE_URL.
 * Env:   BASE_URL (default http://localhost:3000), REQUEST_TIMEOUT_MS (default 10000)
 */
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 10000);

// ---- Test data (unchanged from original) ----
const SESSION_ID = 'test_session_101';
const SERVICE_ID = 'kmut';
const LANGUAGE = 'ta';
const FIRST_QUERY_SESSION_ID = 'test_pmmvy_first_query';
const FIRST_QUERY_TEXT = 'I am pregnant, how do I get the ₹5000 maternity benefit?';
const TAMIL_QUERY = 'கர்ப்பிணி பெண்ணுக்கு ₹5000 எப்போது கிடைக்கும்?';

// ---- Helpers ----
async function request(method, path, body) {
  const options = {
    method,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: 'application/json' },
  };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON body; leave data as null so assertions can report it clearly.
  }
  return { res, data };
}

const post = (path, body) => request('POST', path, body);
const get = (path) => request('GET', path);

function assertOk(res, data, label) {
  assert.equal(res.status, 200, `${label}: expected HTTP 200, got ${res.status}`);
  assert.ok(data && typeof data === 'object', `${label}: response must be a JSON object`);
}

function assertClientError(res, label) {
  assert.ok(
    res.status >= 400 && res.status < 500,
    `${label}: expected 4xx for invalid input, got ${res.status}`
  );
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

// ---- Suite ----
describe('P0 backend API endpoints', () => {
  before(async () => {
    try {
      await fetch(BASE_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (err) {
      throw new Error(`Backend not reachable at ${BASE_URL}: ${err.message}`);
    }
  });

  describe('POST /api/journey/start', () => {
    it('selects PMMVY (not KMUT) for a first-time maternity query', async () => {
      const { res, data } = await post('/api/journey/start', {
        sessionId: FIRST_QUERY_SESSION_ID,
        userText: FIRST_QUERY_TEXT,
        language: 'en',
      });
      assertOk(res, data, 'first-query selection');
      assert.equal(
        data.serviceId,
        'pmmvy',
        `Expected PMMVY for maternity query, got ${data.serviceId}`
      );
    });

    it('starts a journey for an explicit service', async () => {
      const { res, data } = await post('/api/journey/start', {
        sessionId: SESSION_ID,
        serviceId: SERVICE_ID,
        language: LANGUAGE,
      });
      assertOk(res, data, 'start journey');
      assert.ok(data.journeyId, 'journeyId must be present');
      assert.equal(typeof data.currentStep, 'number', 'currentStep must be a number');
      assert.ok(data.currentStep >= 1, 'currentStep must start at 1 or higher');
    });

    it('rejects a request with no sessionId', async () => {
      const { res } = await post('/api/journey/start', {
        serviceId: SERVICE_ID,
        language: LANGUAGE,
      });
      assertClientError(res, 'start without sessionId');
    });
  });

  describe('GET /api/journey/state', () => {
    it('returns the current state of an existing journey', async () => {
      const { res, data } = await get(
        `/api/journey/state?sessionId=${SESSION_ID}&serviceId=${SERVICE_ID}&language=${LANGUAGE}`
      );
      assertOk(res, data, 'journey state');
      assert.equal(typeof data.currentStep, 'number', 'currentStep must be a number');
      assert.ok(isNonEmptyString(data.serviceName), 'serviceName must be a non-empty string');
    });

    it('rejects a request with no sessionId', async () => {
      const { res } = await get(`/api/journey/state?serviceId=${SERVICE_ID}&language=${LANGUAGE}`);
      assertClientError(res, 'state without sessionId');
    });
  });

  describe('POST /api/journey/next', () => {
    it('advances the journey beyond the current step', async () => {
      const currentStep = 1;
      const { res, data } = await post('/api/journey/next', {
        sessionId: SESSION_ID,
        serviceId: SERVICE_ID,
        currentStep,
        language: LANGUAGE,
      });
      assertOk(res, data, 'next step');
      assert.equal(typeof data.currentStep, 'number', 'currentStep must be a number');
      assert.ok(
        data.currentStep > currentStep,
        `Expected step to advance past ${currentStep}, got ${data.currentStep}`
      );
      assert.ok(data.nextAction, 'nextAction must be present');
    });

    it('rejects an unknown serviceId', async () => {
      const { res } = await post('/api/journey/next', {
        sessionId: SESSION_ID,
        serviceId: 'does_not_exist',
        currentStep: 1,
        language: LANGUAGE,
      });
      assertClientError(res, 'next with unknown service');
    });
  });

  describe('POST /api/journey/stuck', () => {
    it('returns a simple explanation for a stuck step', async () => {
      const { res, data } = await post('/api/journey/stuck', {
        sessionId: SESSION_ID,
        serviceId: SERVICE_ID,
        currentStep: 2,
        language: LANGUAGE,
      });
      assertOk(res, data, 'stuck guidance');
      assert.ok(
        isNonEmptyString(data.simpleExplanation),
        'simpleExplanation must be a non-empty string'
      );
    });
  });

  describe('GET /api/service/details', () => {
    it('returns official URL and a non-empty document list', async () => {
      const { res, data } = await get(
        `/api/service/details?serviceId=${SERVICE_ID}&language=${LANGUAGE}`
      );
      assertOk(res, data, 'service details');
      assert.ok(isNonEmptyString(data.officialUrl), 'officialUrl must be a non-empty string');
      assert.doesNotThrow(() => new URL(data.officialUrl), 'officialUrl must be a valid URL');
      assert.ok(Array.isArray(data.documents), 'documents must be an array');
      assert.ok(data.documents.length > 0, 'documents must not be empty');
    });

    it('rejects an unknown serviceId', async () => {
      const { res } = await get(`/api/service/details?serviceId=does_not_exist&language=${LANGUAGE}`);
      assertClientError(res, 'details for unknown service');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('answers a Tamil maternity question and matches a service', async () => {
      const { res, data } = await post('/api/ai/chat', {
        userText: TAMIL_QUERY,
        language: LANGUAGE,
      });
      assertOk(res, data, 'ai chat');
      assert.ok(isNonEmptyString(data.serviceName), 'serviceName must be a non-empty string');
      assert.ok(isNonEmptyString(data.reply), 'reply must be a non-empty string');
    });

    it('rejects an empty userText', async () => {
      const { res } = await post('/api/ai/chat', { userText: '', language: LANGUAGE });
      assertClientError(res, 'chat with empty text');
    });
  });
});
