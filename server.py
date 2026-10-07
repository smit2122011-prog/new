"""
==============================================================
NIRAV Institute of Mathematics & Science – Python Backend
==============================================================
Target WhatsApp Line: +91 8511933922

Features:
- Serves website static assets (HTML, CSS, JS, Images)
- POST /api/enquire: Logs enquiries into enquiries.json and formats WhatsApp link
- GET /api/enquiries: Reads saved enquiries

Usage:
    python server.py
    Open http://localhost:8080 in your browser
"""

import http.server
import socketserver
import os
import json
import urllib.parse
from datetime import datetime

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENQUIRIES_FILE = os.path.join(BASE_DIR, "enquiries.json")
TARGET_WHATSAPP = "918511933922"

# Ensure enquiries.json exists
if not os.path.exists(ENQUIRIES_FILE):
    with open(ENQUIRIES_FILE, "w", encoding="utf-8") as f:
        json.dump([], f, indent=2)

class NiravInstituteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == "/api/enquire":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)

            try:
                data = json.loads(post_body.decode("utf-8") or "{}")

                name = str(data.get("name", "")).strip()
                phone = str(data.get("phone", "")).strip()
                email = str(data.get("email", "")).strip() or None
                class_course = str(data.get("classCourse") or data.get("class") or "General").strip()
                message = str(data.get("message", "")).strip() or "Admission enquiry"

                if not name or not phone:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Name and phone are required"}).encode("utf-8"))
                    return

                lead_record = {
                    "id": f"ENQ-{int(datetime.now().timestamp() * 1000)}",
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "classCourse": class_course,
                    "message": message,
                    "receivedAt": datetime.now().isoformat(),
                    "routedToWhatsApp": TARGET_WHATSAPP,
                    "clientIp": self.client_address[0]
                }

                # Load existing enquiries
                existing = []
                try:
                    with open(ENQUIRIES_FILE, "r", encoding="utf-8") as f:
                        existing = json.load(f)
                        if not isinstance(existing, list):
                            existing = []
                except Exception:
                    existing = []

                existing.insert(0, lead_record)

                with open(ENQUIRIES_FILE, "w", encoding="utf-8") as f:
                    json.dump(existing, f, indent=2, ensure_ascii=False)

                print(f"[Lead Recorded] {name} ({phone}) for {class_course}")

                # Format WhatsApp message
                now_str = datetime.now().strftime("%d %b %Y, %I:%M %p")
                wa_message = (
                    "🎓 *NEW ADMISSION ENQUIRY - NIRAV INSTITUTE*\n"
                    "━━━━━━━━━━━━━━━━━━━━━━━━\n"
                    f"👤 *Name:* {name}\n"
                    f"📱 *Phone:* {phone}\n"
                    f"📧 *Email:* {email or 'Not provided'}\n"
                    f"📚 *Course:* {class_course}\n"
                    f"💬 *Message:* {message}\n"
                    "━━━━━━━━━━━━━━━━━━━━━━━━\n"
                    f"📅 *Time:* {now_str}\n"
                    "🌐 *Source:* NIRAV Institute Website"
                )

                whatsapp_url = f"https://api.whatsapp.com/send?phone={TARGET_WHATSAPP}&text={urllib.parse.quote(wa_message)}"

                response_payload = {
                    "success": True,
                    "message": "Enquiry successfully recorded and prepared for WhatsApp",
                    "leadId": lead_record["id"],
                    "targetWhatsApp": TARGET_WHATSAPP,
                    "whatsappUrl": whatsapp_url
                }

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(response_payload).encode("utf-8"))

            except Exception as e:
                print(f"Error processing enquiry: {e}")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == "/api/enquiries":
            try:
                with open(ENQUIRIES_FILE, "r", encoding="utf-8") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            # Serve static files
            super().do_GET()

if __name__ == "__main__":
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  NIRAV INSTITUTE – PYTHON BACKEND SERVER RUNNING             ║
╠══════════════════════════════════════════════════════════════╣
║  URL:               http://localhost:{PORT}                   ║
║  WhatsApp Lead Line: +91 {TARGET_WHATSAPP}                   ║
║  Leads Database:    enquiries.json                           ║
╚══════════════════════════════════════════════════════════════╝
    """)
    with socketserver.TCPServer(("", PORT), NiravInstituteHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
