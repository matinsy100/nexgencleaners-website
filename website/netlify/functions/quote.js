exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Pull both URLs from your Netlify Environment Variables
  const URL1 = process.env.SHEET_URL;
  const URL2 = process.env.SHEET_URL1; 
  
  const data = JSON.parse(event.body);

  try {
    // Send to both URLs simultaneously
    await Promise.all([
      fetch(URL1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
      fetch(URL2, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'success' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send to one or more sheets' })
    };
  }
};
