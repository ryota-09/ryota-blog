#!/bin/bash

echo "Starting Next.js development server..."
npm run dev > dev-server.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 10

echo "Running e2e tests..."
npx playwright test

TEST_RESULT=$?

echo "Shutting down server..."
kill $SERVER_PID

exit $TEST_RESULT
