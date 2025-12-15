# Performance Testing Lab

A simple Node.js backend server for performance testing with k6.

## Setup

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Available Endpoints

- `GET /` - Main endpoint with request counter
- `GET /health` - Health check endpoint
- `GET /slow` - Slow endpoint with 1 second delay
- `GET /data` - Returns sample user data

## Running Performance Tests

Make sure the server is running, then execute k6 tests:

```bash
k6 run performance-testing-lab.js
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:
1. Starts the Node.js server
2. Runs k6 performance tests
3. Reports results

Push to the `test-ci` branch to trigger the workflow.
