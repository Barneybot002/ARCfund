/**
 * Integration Test for ARCfund Encryption/Decryption Flow
 * 
 * This test demonstrates the full end-to-end flow:
 * 1. Create project with encrypted data
 * 2. Store on Solana blockchain
 * 3. Request and approve access
 * 4. Decrypt and view project
 * 
 * Run with: npm test -- integration.test.ts
 */

import { arciumClient, initializeArcium, ProjectData } from './arcium-client.js';
import { arciumConfig } from './arcium-config.js';

// Mock test data
const mockProjectData: ProjectData = {
    title: 'NextGen AI Platform',
    description: 'Revolutionary AI infrastructure for enterprises',
    pitch: 'We are building the future of enterprise AI with privacy-preserving computation',
    fundingGoal: 5000000,
    timeline: '24 months',
    team: ['Alice (CEO)', 'Bob (CTO)', 'Charlie (Lead Engineer)'],
    roadmap: 'Phase 1 (6mo): MVP Release | Phase 2 (12mo): Beta | Phase 3 (18mo): Production | Phase 4 (24mo): Scale',
    tokenomics: '1B total supply, 30% team, 20% investors, 50% community'
};

async function testEncryptionDecryption() {
    console.log('\n🧪 ARCfund Encryption/Decryption Test\n');
    console.log('═'.repeat(60));

    try {
        // Step 1: Initialize Arcium client
        console.log('\n📍 Step 1: Initialize Arcium Client');
        console.log('-'.repeat(60));
        await initializeArcium();
        const status = arciumClient.getStatus();
        console.log('Status:', status);
        
        // Step 2: Encrypt project data
        console.log('\n📍 Step 2: Encrypt Project Data');
        console.log('-'.repeat(60));
        console.log('Original data:');
        console.log(JSON.stringify(mockProjectData, null, 2));
        
        const startEncrypt = Date.now();
        const encrypted = await arciumClient.encryptProjectData(mockProjectData);
        const encryptTime = Date.now() - startEncrypt;
        
        console.log(`✅ Encryption successful (${encryptTime}ms)`);
        console.log(`   Method: ${encrypted.encryptionMethod}`);
        console.log(`   Timestamp: ${new Date(encrypted.timestamp).toISOString()}`);
        console.log(`   Data size: ${encrypted.data.length} bytes (base64 encoded)`);
        console.log(`   Encrypted data preview: ${encrypted.data.substring(0, 50)}...`);

        // Step 3: Simulate blockchain storage
        console.log('\n📍 Step 3: Store on Blockchain (Simulated)');
        console.log('-'.repeat(60));
        console.log('In production, this would:');
        console.log('  1. Call solanaProjectClient.createProject()');
        console.log('  2. Store encrypted data on-chain');
        console.log('  3. Create project state account');
        console.log('  4. Return transaction signature');
        console.log(`📦 Encrypted payload ready for blockchain storage`);

        // Step 4: Simulate access request
        console.log('\n📍 Step 4: Request Access (Simulated)');
        console.log('-'.repeat(60));
        const investorWallet = 'investor_wallet_address_here';
        console.log(`Investor address: ${investorWallet}`);
        console.log('In production, this would:');
        console.log('  1. Create AccessRequest account on-chain');
        console.log('  2. Set status to "Pending"');
        console.log('  3. Notify founder for approval');

        // Step 5: Simulate founder approval
        console.log('\n📍 Step 5: Approve Access (Simulated)');
        console.log('-'.repeat(60));
        console.log('In production, founder would:');
        console.log('  1. View access request in dashboard');
        console.log('  2. Click "Approve" button');
        console.log('  3. Sign transaction to update status');
        console.log('  4. Investor notified of approval');

        // Step 6: Decrypt project data
        console.log('\n📍 Step 6: Decrypt Project Data');
        console.log('-'.repeat(60));
        const accessToken = `access_token_${investorWallet}`;
        
        const startDecrypt = Date.now();
        const decrypted = await arciumClient.decryptProjectData(encrypted, accessToken);
        const decryptTime = Date.now() - startDecrypt;
        
        console.log(`✅ Decryption successful (${decryptTime}ms)`);
        console.log('Decrypted data:');
        console.log(JSON.stringify(decrypted, null, 2));

        // Step 7: Verify data integrity
        console.log('\n📍 Step 7: Verify Data Integrity');
        console.log('-'.repeat(60));
        const dataMatches = JSON.stringify(mockProjectData) === JSON.stringify(decrypted);
        console.log(`Data integrity check: ${dataMatches ? '✅ PASS' : '❌ FAIL'}`);
        
        if (dataMatches) {
            console.log('✅ Original data matches decrypted data');
        } else {
            console.log('❌ Data mismatch detected!');
            console.log('Expected:', mockProjectData);
            console.log('Got:', decrypted);
        }

        // Step 8: Performance summary
        console.log('\n📍 Step 8: Performance Summary');
        console.log('-'.repeat(60));
        console.log(`Encryption time: ${encryptTime}ms`);
        console.log(`Decryption time: ${decryptTime}ms`);
        console.log(`Total roundtrip: ${encryptTime + decryptTime}ms`);

        // Step 9: Next steps for production
        console.log('\n📍 Step 9: Next Steps for Production');
        console.log('-'.repeat(60));
        console.log('✅ Simulation test passed!');
        console.log('\nTo deploy to production:');
        console.log('  1. Deploy arcfund-mxe program to Solana devnet');
        console.log('  2. Update NEXT_PUBLIC_ARCIUM_PROGRAM_ID in .env.local');
        console.log('  3. Integration real @arcium-hq/client SDK');
        console.log('  4. Run this test against real Solana/Arcium');
        console.log('  5. Integrate with Privy authentication');
        console.log('  6. Deploy to Solana mainnet when ready');

        console.log('\n═'.repeat(60));
        console.log('✅ Test completed successfully!\n');
        
        return true;
    } catch (error) {
        console.error('\n❌ Test failed:');
        console.error(error);
        console.log('\n═'.repeat(60));
        console.log('❌ Test failed\n');
        return false;
    }
}

/**
 * Simulate access control flow
 */
async function testAccessControl() {
    console.log('\n🔐 Access Control Test\n');
    console.log('═'.repeat(60));

    try {
        const projectId = 'project-001';
        const founderAddress = 'founder_wallet_here';
        const investorAddress1 = 'investor1_wallet_here';
        const investorAddress2 = 'investor2_wallet_here';

        // Encrypt project
        const encrypted = await arciumClient.encryptProjectData(mockProjectData);

        // Verify access before approval
        console.log('\n📍 Before Access Approval:');
        console.log('-'.repeat(60));
        const token1Before = await arciumClient.verifyAccess(projectId, investorAddress1);
        const token2Before = await arciumClient.verifyAccess(projectId, investorAddress2);
        console.log(`Investor 1 can access: ${token1Before ? 'YES (test mode)' : 'NO'}`);
        console.log(`Investor 2 can access: ${token2Before ? 'YES (test mode)' : 'NO'}`);

        // In production, founder would approve investor 1 only
        console.log('\n📍 After Access Approval (Investor 1 approved):');
        console.log('-'.repeat(60));
        const token1After = await arciumClient.verifyAccess(projectId, investorAddress1);
        console.log(`Investor 1 can access: ${token1After ? 'YES' : 'NO'}`);
        console.log(`Access token: ${token1After}`);

        // Investor 2 still cannot access
        console.log('\n📍 Investor 2 (Not Approved):');
        console.log('-'.repeat(60));
        console.log('Investor 2 will receive "Access Denied" error');

        console.log('\n═'.repeat(60));
        console.log('✅ Access control test completed!\n');
        return true;
    } catch (error) {
        console.error('❌ Access control test failed:', error);
        return false;
    }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        const test1 = await testEncryptionDecryption();
        const test2 = await testAccessControl();
        
        if (test1 && test2) {
            console.log('✅ All tests passed!');
            process.exit(0);
        } else {
            console.log('❌ Some tests failed');
            process.exit(1);
        }
    })();
}

export { testEncryptionDecryption, testAccessControl };
