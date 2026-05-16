export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const response = await fetch(targetUrl);
        
        if (!response.ok) {
            return res.status(response.status).send(`Target responded with status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');

        const buffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error('Serverless Proxy Error:', error.message);
        return res.status(500).send('Error fetching remote file through Vercel');
    }
}
