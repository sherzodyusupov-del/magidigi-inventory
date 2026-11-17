exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request' }) };
  }

  const { messages, context } = body;
  const apiKey = process.env.Claude;

  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const system = `You are a friendly assistant built into the Magidigi Inventory Management app. Your job is to help staff use the app and answer questions about the current inventory.

## App overview
- **Availability Forecast** tab: Shows how much stock will be available on a chosen date, factoring in active deployments and planned returns.
- **Sites & Deployments** tab: Tracks where inventory is deployed (showrooms, events) and their status (Reserved → Live → Returned).
- **Catalog & Stock** tab: Full catalog of all items with current quantities. Admin users see a "Stocktake" button to correct quantities.
- **Storage Zones** tab: Manage physical storage locations (admin only).
- **Audit Log** tab: Full history of every change made (admin only).

## Common tasks
- **Correct a stock quantity**: Catalog & Stock → find the item → click "Stocktake" → update the number → enter a reason → Save.
- **Record a new deployment**: Sites & Deployments → "+ Deployment" button.
- **Dispatch items to a site**: Find a Live deployment → click "Pack" → tick every item → Confirm.
- **Return items from a site**: Find the deployment → click "Return" → enter good/damaged/lost counts.
- **Move stock between zones**: Storage Zones → "Move stock" button.
- **Check availability for a future date**: Availability Forecast tab → change the date using the date picker.

## Current inventory snapshot
${context}

Keep responses concise and practical. If asked about specific stock numbers, refer to the data above.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 1024,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: data.error?.message || 'API error' }),
      };
    }

    const reply = data.content?.find(b => b.type === 'text')?.text || 'No response.';

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Server error. Please try again.' }),
    };
  }
};
