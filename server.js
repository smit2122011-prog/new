/**
 * ══════════════════════════════════════════════════════════════
 * NIRAV Institute of Mathematics & Science – Backend Server
 * ══════════════════════════════════════════════════════════════
 * Target WhatsApp line: +91 8511933922
 * 
 * Features:
 * - Serves frontend static files
 * - POST /api/enquire: Records incoming admission leads to enquiries.json
 * - Constructs WhatsApp message URL
 * - Optional automated WhatsApp webhook dispatch
 * 
 * Usage:
 *   node server.js
 *   Open http://localhost:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;
const ENQUIRIES_FILE = path.join(__dirname, 'enquiries.json');
const TARGET_WHATSAPP = '918511933922';

// Ensure enquiries.json exists
if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// MIME types for static assets
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS for API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ─────────────────────────────────────────────────────────────
    // API: POST /api/enquire
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/enquire' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            // Safeguard max 1MB
            if (body.length > 1e6) req.destroy();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');

                if (!data.name || !data.phone) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Name and phone are required' }));
                    return;
                }

                // Lead record
                const leadRecord = {
                    id: 'ENQ-' + Date.now(),
                    name: String(data.name).trim(),
                    phone: String(data.phone).trim(),
                    email: String(data.email || '').trim() || null,
                    classCourse: String(data.classCourse || data.class || 'General').trim(),
                    message: String(data.message || '').trim() || 'Admission enquiry',
                    receivedAt: new Date().toISOString(),
                    routedToWhatsApp: TARGET_WHATSAPP,
                    ip: req.socket.remoteAddress
                };

                // Read existing enquiries and append
                let existing = [];
                try {
                    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
                    existing = JSON.parse(raw);
                    if (!Array.isArray(existing)) existing = [];
                } catch (e) {
                    existing = [];
                }

                existing.unshift(leadRecord);
                fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(existing, null, 2), 'utf-8');

                console.log(`[Lead Recorded] ${leadRecord.name} (${leadRecord.phone}) for ${leadRecord.classCourse}`);

                // Formatted WhatsApp text
                const waMessage = 
                    '🎓 *NEW ADMISSION ENQUIRY - NIRAV INSTITUTE*\n' +
                    '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                    '👤 *Name:* ' + leadRecord.name + '\n' +
                    '📱 *Phone:* ' + leadRecord.phone + '\n' +
                    '📧 *Email:* ' + (leadRecord.email || 'Not provided') + '\n' +
                    '📚 *Course:* ' + leadRecord.classCourse + '\n' +
                    '💬 *Message:* ' + leadRecord.message + '\n' +
                    '━━━━━━━━━━━━━━━━━━━━━━━━\n' +
                    '📅 *Time:* ' + new Date().toLocaleString('en-IN') + '\n' +
                    '🌐 *Source:* NIRAV Institute Website';

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${TARGET_WHATSAPP}&text=${encodeURIComponent(waMessage)}`;

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Enquiry successfully recorded and prepared for WhatsApp',
                    leadId: leadRecord.id,
                    targetWhatsApp: TARGET_WHATSAPP,
                    whatsappUrl: whatsappUrl
                }));
            } catch (err) {
                console.error('Error parsing enquiry:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server error saving enquiry' }));
            }
        });
        return;
    }

    // ─────────────────────────────────────────────────────────────
    // API: GET /api/enquiries (View saved leads)
    // ─────────────────────────────────────────────────────────────
    if (pathname === '/api/enquiries' && req.method === 'GET') {
        try {
            const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(raw);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read enquiries' }));
        }
        return;
    }

    // ─────────────────────────────────────────────────────────────
    // Static File Serving
    // ─────────────────────────────────────────────────────────────
    let safePath = pathname === '/' ? '/index.html' : pathname;
    let filePath = path.join(PUBLIC_DIR, safePath);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  NIRAV INSTITUTE – BACKEND SERVER RUNNING                    ║
╠══════════════════════════════════════════════════════════════╣
║  URL:               http://localhost:${PORT}                   ║
║  WhatsApp Lead Line: +91 ${TARGET_WHATSAPP}                   ║
║  Leads Database:    enquiries.json                           ║
╚══════════════════════════════════════════════════════════════╝
    `);
});
