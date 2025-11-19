#!/bin/bash

# Test setup script
echo "Setting up test environment..."

# Copy test env file
cp .env.test .env.local.test

# Create test database (if needed)
# Add your test database setup here

echo "Test environment ready!"

