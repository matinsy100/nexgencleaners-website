exports.handler = async (event) => {
  // 1. Security check: Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 2. Access your 2 Keys
  const URL1 = process.env.SHEET_URL;
  const URL2 = process.env.SHEET_URL1;

  try {
    const data = JSON.parse(event.body);

    // 3. Send the data to both keys at the same time
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
      body: JSON.stringify({ result: 'Success! Both sheets updated.' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update one or both sheets.' })
    };
  }
};
  }
};
