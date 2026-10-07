# NIRAV Institute of Mathematics & Science – Website & WhatsApp Backend

A high-converting, professional website for **NIRAV Institute of Mathematics & Science**, Anand, Gujarat.

---

## 📱 WhatsApp Integration Overview (Target: 8511933922)

Whenever a student or parent fills in the **"Enquire Now"** form:
1. **Instant Formatted WhatsApp Message**:
   The user's Name, Phone, Email, Selected Course (Classes 8–12 / JEE / NEET), and Query Message are compiled into a WhatsApp message:
   ```text
   🎓 *NEW ADMISSION ENQUIRY - NIRAV INSTITUTE*
   ━━━━━━━━━━━━━━━━━━━━━━━━
   👤 *Student / Parent Name:* Rajesh Patel
   📱 *Mobile Number:* 9898123456
   📧 *Email:* rajesh@example.com
   📚 *Class / Target Course:* Class 11 Science (CBSE / NCERT)
   💬 *Query / Message:* Need information regarding evening batches and demo lecture.
   ━━━━━━━━━━━━━━━━━━━━━━━━
   📅 *Received:* 07 Oct 2026, 08:00 PM
   🌐 *Source:* NIRAV Institute Website
   ```
2. **Direct WhatsApp Launch**:
   Opens WhatsApp (Web or Mobile app) routed directly to **`+91 8511933922`** with all message text ready to send in one tap.
3. **Lead Backup Database (`enquiries.json`)**:
   Every submission is also recorded in the backend lead log so no student enquiry is ever lost.
4. **Floating WhatsApp Button & Contact Cards**:
   The sticky floating WhatsApp button and the contact card link directly to WhatsApp at **+91 8511933922**.

---

## 📁 File Structure

```text
nirav-institute/
├── index.html        # Main landing page with WhatsApp enquiry form
├── style.css         # Deep Navy & Gold design, WhatsApp styling, responsive layout
├── script.js         # Interactive JS, validation, WhatsApp message builder & lead dispatcher
├── server.js         # Node.js backend (POST /api/enquire, logs to enquiries.json)
├── server.py         # Python 3.12 backend (POST /api/enquire, logs to enquiries.json)
├── enquiries.json    # Local JSON lead database where enquiries are stored
├── hero-bg.jpg       # High-res math & science background pattern
└── README.md         # Documentation & guide
```

---

## 🚀 How to Run the Website & Backend

### Method 1: Client-Side Instant Mode (Zero Setup)
Double-click `index.html` in your browser.
- **WhatsApp form submission works 100% out-of-the-box** without needing any server running!
- Tapping **"Send Enquiry via WhatsApp"** opens WhatsApp directly to `+91 8511933922`.

---

### Method 2: Running with Python Backend
Since Python is already installed on your machine:
```powershell
cd C:\Users\HP\Desktop\nirav-institute
python server.py
```
Open **`http://localhost:8080`** in your browser.
- Serves the site.
- Records all enquiries into `enquiries.json`.
- Directs the user to WhatsApp with the lead pre-filled.
- View recorded leads anytime at **`http://localhost:8080/api/enquiries`**.

---

### Method 3: Running with Node.js Backend
If you prefer Node.js:
```powershell
cd C:\Users\HP\Desktop\nirav-institute
node server.js
```
Open **`http://localhost:8080`** in your browser.
- Same zero-dependency API and lead storage in `enquiries.json`.

---

## 📞 Institute Contact Summary
- **Voice Calling Number**: +91 98246 94138 (Office / Calls)
- **WhatsApp Admission Line**: +91 85119 33922 (Enquiry Form & WhatsApp Chat)
- **Address**: 201–202, Krishna Saffron Complex, Anand–Vidyanagar Road, Vallabh Vidyanagar, Anand, Gujarat 388001
- **Rating**: 5.0 ★ Google Rating (71+ Reviews)
