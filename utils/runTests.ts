import { createTestAccounts } from './testUtils';

async function runTests() {
  try {
    await createTestAccounts();
    console.log('Test accounts created successfully');
  } catch (error) {
    console.error('Error creating test accounts:', error);
  }
}

runTests();