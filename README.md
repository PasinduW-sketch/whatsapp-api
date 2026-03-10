# Free WhatsApp API

A free WhatsApp API that allows you to send messages and share locations without using the paid WhatsApp Business API.

## Features ✨

- ✅ Send text messages for FREE
- ✅ Share live locations
- ✅ Send message with location combined
- ✅ Get all contacts
- ✅ RESTful API
- ✅ No WhatsApp Business API costs
- ✅ Uses whatsapp-web.js (unofficial free library)

## Installation 🚀

1. **Install Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm start
```

4. **Scan QR Code:**
   - When the server starts, a QR code will appear in the terminal
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices > Link a Device
   - Scan the QR code from the terminal

## API Endpoints 📡

### 1. Health Check
```http
GET http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "connected": true,
  "message": "WhatsApp is connected"
}
```

### 2. Send Text Message
```http
POST http://localhost:3000/send-message
Content-Type: application/json

{
  "number": "+1234567890",
  "message": "Hello from WhatsApp API!"
}
```

Response:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "true_1234567890@c.us_ABC123",
    "timestamp": 1234567890,
    "number": "+1234567890"
  }
}
```

### 3. Send Location
```http
POST http://localhost:3000/send-location
Content-Type: application/json

{
  "number": "+1234567890",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "description": "San Francisco, CA"
}
```

Response:
```json
{
  "success": true,
  "message": "Location sent successfully",
  "data": {
    "id": "true_1234567890@c.us_DEF456",
    "timestamp": 1234567890,
    "number": "+1234567890",
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

### 4. Send Message with Location
```http
POST http://localhost:3000/send-message-with-location
Content-Type: application/json

{
  "number": "+1234567890",
  "message": "Check out this location!",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "locationDescription": "San Francisco, CA"
}
```

### 5. Get All Contacts
```http
GET http://localhost:3000/contacts
```

Response:
```json
{
  "success": true,
  "contacts": [
    {
      "id": "1234567890@c.us",
      "name": "John Doe",
      "number": "1234567890",
      "isMyContact": true
    }
  ],
  "total": 50
}
```

## Usage Examples 💡

### Using cURL:

**Send a message:**
```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"+1234567890\",\"message\":\"Hello World!\"}"
```

**Send a location:**
```bash
curl -X POST http://localhost:3000/send-location \
  -H "Content-Type: application/json" \
  -d "{\"number\":\"+1234567890\",\"latitude\":37.7749,\"longitude\":-122.4194,\"description\":\"My Location\"}"
```

### Using JavaScript (Fetch API):

```javascript
// Send message
async function sendMessage(number, message) {
  const response = await fetch('http://localhost:3000/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ number, message })
  });
  
  const result = await response.json();
  console.log(result);
}

// Send location
async function sendLocation(number, lat, lng, description) {
  const response = await fetch('http://localhost:3000/send-location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      number, 
      latitude: lat, 
      longitude: lng,
      description 
    })
  });
  
  const result = await response.json();
  console.log(result);
}

// Example usage
sendMessage('+1234567890', 'Hello from API!');
sendLocation('+1234567890', 37.7749, -122.4194, 'San Francisco');
```

### Using Python:

```python
import requests

# Send message
def send_message(number, message):
    url = 'http://localhost:3000/send-message'
    data = {'number': number, 'message': message}
    response = requests.post(url, json=data)
    return response.json()

# Send location
def send_location(number, latitude, longitude, description=''):
    url = 'http://localhost:3000/send-location'
    data = {
        'number': number,
        'latitude': latitude,
        'longitude': longitude,
        'description': description
    }
    response = requests.post(url, json=data)
    return response.json()

# Example usage
send_message('+1234567890', 'Hello from Python!')
send_location('+1234567890', 37.7749, -122.4194, 'San Francisco')
```

## Number Format 📱

- Include country code (e.g., +1 for USA, +91 for India)
- Remove any spaces, dashes, or special characters
- Examples:
  - ✅ `+1234567890`
  - ✅ `+911234567890`
  - ❌ `123-456-7890`
  - ❌ `(123) 456-7890`

## Important Notes ⚠️

1. **Keep your phone connected**: Your phone needs to have an active internet connection for the API to work
2. **QR Code expires**: If you don't scan the QR code quickly, restart the server to get a new one
3. **Session persistence**: The session is saved automatically, so you won't need to scan the QR code every time
4. **Rate limiting**: Don't send too many messages too quickly to avoid being flagged by WhatsApp
5. **This is unofficial**: This uses whatsapp-web.js, which is not affiliated with WhatsApp Inc.

## Troubleshooting 🔧

**QR Code not showing?**
- Make sure your terminal supports it
- Check the console logs for the QR code

**Authentication failed?**
- Restart the server and try scanning again
- Make sure your phone has internet connection

**Message not sending?**
- Check if the number format is correct
- Verify WhatsApp is connected (check /health endpoint)
- Make sure your phone is online

## Development Mode 🛠️

To run with auto-reload on file changes:

```bash
npm run dev
```

## License 📄

MIT License - Free to use!

## Support 💬

If you encounter any issues:
1. Check if Node.js is properly installed
2. Make sure all dependencies are installed (`npm install`)
3. Ensure your WhatsApp is working on your phone
4. Check the console for error messages

Enjoy your FREE WhatsApp API! 🎉
