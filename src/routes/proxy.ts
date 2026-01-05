import { Hono } from 'hono';

const proxy = new Hono();

// The R2 URL for the Jet
const JET_URL = 'https://pub-febda61713d64e768cd4a841fec58f63.r2.dev/Meshy_AI_Jet_in_Flight_0104205113_texture.glb';

proxy.get('/jet.glb', async (c) => {
    // 1. Fetch the asset from R2
    const response = await fetch(JET_URL);

    if (!response.ok) {
        return c.text(`Failed to fetch asset: ${response.status}`, 502);
    }

    // 2. Clone the response headers but ensure CORS is permissive
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Content-Type', 'model/gltf-binary'); // Ensure correct MIME type

    // 3. Return the asset with the new headers
    return new Response(response.body, {
        status: response.status,
        headers: newHeaders
    });
});

export default proxy;
