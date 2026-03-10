// Simple test script for WhatsApp API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

// Test 1: Health Check
async function testHealth() {
    console.log('\n🔍 Testing Health Check...');
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('✅ Health:', data);
        return data.connected;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// Test 2: Send Message
async function testSendMessage() {
    console.log('\n📤 Testing Send Message...');
    try {
        const response = await fetch(`${API_URL}/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                number: '+1234567890', // Replace with your test number
                message: 'Hello from WhatsApp API Test! 🎉'
            })
        });
        const data = await response.json();
        console.log('✅ Message sent:', data);
    } catch (error) {
        console.error('❌ Send message failed:', error.message);
    }
}

// Test 3: Send Location
async function testSendLocation() {
    console.log('\n📍 Testing Send Location...');
    try {
        const response = await fetch(`${API_URL}/send-location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                number: '+1234567890', // Replace with your test number
                latitude: 37.7749,
                longitude: -122.4194,
                description: 'San Francisco, CA'
            })
        });
        const data = await response.json();
        console.log('✅ Location sent:', data);
    } catch (error) {
        console.error('❌ Send location failed:', error.message);
    }
}

// Test 4: Send Message with Location
async function testSendMessageWithLocation() {
    console.log('\n📨 Testing Send Message with Location...');
    try {
        const response = await fetch(`${API_URL}/send-message-with-location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                number: '+1234567890', // Replace with your test number
                message: 'Check out this location! 🗺️',
                latitude: 37.7749,
                longitude: -122.4194,
                locationDescription: 'San Francisco, California'
            })
        });
        const data = await response.json();
        console.log('✅ Message with location sent:', data);
    } catch (error) {
        console.error('❌ Send message with location failed:', error.message);
    }
}

// Test 5: Get Contacts
async function testGetContacts() {
    console.log('\n👥 Testing Get Contacts...');
    try {
        const response = await fetch(`${API_URL}/contacts`);
        const data = await response.json();
        console.log('✅ Contacts retrieved:', data.contacts.length, 'contacts found');
        if (data.contacts.length > 0) {
            console.log('First few contacts:');
            data.contacts.slice(0, 3).forEach(contact => {
                console.log(`  - ${contact.name}: ${contact.number}`);
            });
        }
    } catch (error) {
        console.error('❌ Get contacts failed:', error.message);
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting WhatsApp API Tests...\n');
    console.log('=' .repeat(50));
    
    const isConnected = await testHealth();
    
    if (!isConnected) {
        console.log('\n⚠️  WhatsApp is not connected. Please scan the QR code first.');
        console.log('Run: npm start');
        return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSendMessage();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSendLocation();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSendMessageWithLocation();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testGetContacts();
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ All tests completed!\n');
}

runTests();
