exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const SHEET_URL = process.env.SHEET_URL;
  const data = JSON.parse(event.body);

  await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ result: 'success' })
  };
};
