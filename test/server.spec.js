const request = require('supertest');
const app = require('../app');

describe('server', () => {
    test('should respond 404 to "/" using no URL parameters', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(404);
    });

    test('should respond 405 to "/" with http method POST', async () => {
        const res = await request(app).post('/');
        expect(res.status).toBe(405);
    });

    test('should respond 200 to "/embed" with config_id & dom_id given', async () => {
        const res = await request(app).get('/embed?config_id=test&dom_id=test');
        expect(res.status).toBe(200);
    });

    test('should respond 200 to "/" with config_id & dom_id given', async () => {
        const res = await request(app).get('/?config_id=test&dom_id=test');
        expect(res.status).toBe(200);
    });

    test('should respond 200 to "/build" with version number at body', async () => {
        const res = await request(app).get('/build');
        expect(res.status).toBe(200);
    });

    test('should respond 405 to "/embed" with config_id & dom_id given and http method POST', async () => {
        const res = await request(app).post('/embed?config_id=test&dom_id=test');
        expect(res.status).toBe(405);
    });

    test('should respond 404 to "/embed" ', async () => {
        const res = await request(app).get('/embed');
        expect(res.status).toBe(404);
    });

    test('should respond 404 to everything else ', async () => {
        const res = await request(app).get('/xyz');
        expect(res.status).toBe(404);
    });

    // Dynamic Configuration at embed_test
    test('should respond 200 to "/embed_test" without params', async () => {
        const res = await request(app).get('/embed_test');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Demo');
    });
    
    test('should respond 200 to "/embed" with config_id set to "Test"', async () => {
        const res = await request(app).get('/embed?config_id=test&dom_id=test');
        expect(res.status).toBe(200);
        expect(res.text).toContain('test');
    });
});