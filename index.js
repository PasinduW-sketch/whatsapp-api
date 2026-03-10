const express = require('express');
const { Client, Location } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp Client
let client;
let isReady = false;

// Initialize WhatsApp Client
function initializeWhatsAppClient() {
    client = new Client({
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    // QR Code event
    client.on('qr', (qr) => {
        console.log('Scan this QR code to connect to WhatsApp:');
        qrcode.generate(qr, { small: true });
    });

    // Ready event
    client.on('ready', () => {
        console.log('✅ WhatsApp Client is ready!');
        isReady = true;
    });

    // Authentication events
    client.on('authenticated', () => {
        console.log('✅ Authenticated!');
    });

    client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failed:', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('🔴 Disconnected:', reason);
        isReady = false;
    });

    // Initialize the client
    client.initialize();
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        connected: isReady,
        message: isReady ? 'WhatsApp is connected' : 'WhatsApp is not connected'
    });
});

// Send text message endpoint
app.post('/send-message', async (req, res) => {
    try {
        const { number, message } = req.body;

        if (!number || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Number and message are required' 
            });
        }

        if (!isReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'WhatsApp client is not connected' 
            });
        }

        // Format the number (remove + and spaces, add @c.us)
        const formattedNumber = number.replace('+', '').replace(/\s/g, '') + '@c.us';

        // Send the message
        const chat = await client.getChatById(formattedNumber);
        const result = await chat.sendMessage(message);

        res.json({ 
            success: true, 
            message: 'Message sent successfully',
            data: {
                id: result.id._serialized,
                timestamp: result.timestamp,
                number: number
            }
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Send location endpoint
app.post('/send-location', async (req, res) => {
    try {
        const { number, latitude, longitude, description = 'Location' } = req.body;

        if (!number || !latitude || !longitude) {
            return res.status(400).json({ 
                success: false, 
                error: 'Number, latitude, and longitude are required' 
            });
        }

        if (!isReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'WhatsApp client is not connected' 
            });
        }

        // Format the number
        const formattedNumber = number.replace('+', '').replace(/\s/g, '') + '@c.us';

        // Create location object
        const location = new Location(latitude, longitude, description);

        // Send the location
        const chat = await client.getChatById(formattedNumber);
        const result = await chat.sendLocation(location);

        res.json({ 
            success: true, 
            message: 'Location sent successfully',
            data: {
                id: result.id._serialized,
                timestamp: result.timestamp,
                number: number,
                latitude: latitude,
                longitude: longitude
            }
        });

    } catch (error) {
        console.error('Error sending location:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Send message with location (combined)
app.post('/send-message-with-location', async (req, res) => {
    try {
        const { number, message, latitude, longitude, locationDescription = 'Shared Location' } = req.body;

        if (!number || !message || !latitude || !longitude) {
            return res.status(400).json({ 
                success: false, 
                error: 'Number, message, latitude, and longitude are required' 
            });
        }

        if (!isReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'WhatsApp client is not connected' 
            });
        }

        // Format the number
        const formattedNumber = number.replace('+', '').replace(/\s/g, '') + '@c.us';

        // Send the message first
        const chat = await client.getChatById(formattedNumber);
        const messageResult = await chat.sendMessage(message);

        // Send the location
        const location = new Location(latitude, longitude, locationDescription);
        const locationResult = await chat.sendLocation(location);

        res.json({ 
            success: true, 
            message: 'Message and location sent successfully',
            data: {
                message: {
                    id: messageResult.id._serialized,
                    timestamp: messageResult.timestamp
                },
                location: {
                    id: locationResult.id._serialized,
                    timestamp: locationResult.timestamp,
                    latitude: latitude,
                    longitude: longitude
                },
                number: number
            }
        });

    } catch (error) {
        console.error('Error sending message with location:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get all contacts endpoint
app.get('/contacts', async (req, res) => {
    try {
        if (!isReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'WhatsApp client is not connected' 
            });
        }

        const contacts = await client.getContacts();
        
        const contactList = contacts.map(contact => ({
            id: contact.id._serialized,
            name: contact.name || contact.pushname || 'Unknown',
            number: contact.number,
            isMyContact: contact.isMyContact
        }));

        res.json({ 
            success: true, 
            contacts: contactList,
            total: contactList.length
        });

    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp API Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT}/health to check status`);
    
    // Initialize WhatsApp client
    initializeWhatsAppClient();
});
