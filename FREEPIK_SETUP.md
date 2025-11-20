# Freepik Image Generation Setup

## Getting Your API Key

1. Go to [Freepik API](https://www.freepik.com/api/)
2. Sign up with your email (free credits available)
3. Navigate to your dashboard
4. Get your API key from the API Keys section
5. Add it to `.env.local`:
   ```env
   NEXT_PUBLIC_FREEPIK_API_KEY=your_api_key_here
   ```

## Testing the API

To test if your API key is working:

1. Check the browser console when clicking on an exercise/meal
2. Check the server console (terminal) for API response logs
3. The logs will show:
   - The API response structure
   - Any errors from Freepik
   - The image URL if successful

## Troubleshooting

### If images aren't generating:

1. **Check API Key**: Make sure `NEXT_PUBLIC_FREEPIK_API_KEY` is set in `.env.local`
2. **Restart Server**: After adding the API key, restart your Next.js dev server
3. **Check Console**: Look for error messages in:
   - Browser console (F12)
   - Server terminal
4. **Verify Credits**: Make sure you have credits in your Freepik account
5. **Check API Response**: The server logs will show the exact response from Freepik

### Common Issues:

- **401 Unauthorized**: Invalid or missing API key
- **403 Forbidden**: No credits remaining
- **400 Bad Request**: Invalid request parameters
- **Empty Response**: API might be returning data in a different format

## API Endpoint

The app uses:
- **Endpoint**: `https://api.freepik.com/v1/ai/text-to-image/google/gemini-2-5-flash-image-preview`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `x-freepik-api-key: YOUR_API_KEY`

## Response Format

The API might return images in different formats:
- `data.data.url`
- `data.url`
- `data.image_url`
- `data.result.url`

The code handles all these formats automatically.

