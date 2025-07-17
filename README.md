
# 📱 MockSMS – Fake SMS Testing Platform for Developers

**MockSMS** is a full-stack developer tool that simulates SMS delivery — just like Mailhog or Mailtrap do for emails. No real SMS APIs are used — all messages are stored and displayed in a developer dashboard, with support for sending OTPs and verifying them.

> 🚫 **No actual SMS is sent.** Use it for development & testing environments.

---

## 🔗 Live Demo

👉 **[Open MockSMS Dashboard](https://mock-sms.vercel.app/)**

> ⚠️ Hosted on free Render + Vercel tiers. May take a few seconds to wake up on first request.

---

## 🚀 Quick Walkthrough

1. **Visit the [Live Dashboard](https://mock-sms.vercel.app/)**
2. **Create an account** and log in
3. A **default project** will be created automatically
4. Go to **"Projects → API Keys"** to view your API key
5. Use that API key to **call the public APIs** from your apps (see below)
6. View all messages (SMS + OTPs) in your dashboard for each project

---

## ⚙️ Features

- ✅ Simulated SMS inbox per project
- ✅ JWT-based auth with refresh + access token
- ✅ REST APIs for sending generic SMS, OTP, and verifying OTP
- ✅ Messages auto-expire after 24 hours
- ✅ Manual delete support
- ✅ Modern developer UI with project & key management

---

## 🧪 Public API Usage Guide

Use your API key in headers to test SMS flows from your own apps.

📍 **Base URL:**  
```
https://mock-sms-backend.onrender.com/api
```

---

### 1️⃣ Send Generic SMS

**POST** `/message/send`

#### Headers:
```http
x-api-key: your_project_api_key
Content-Type: application/json
```

#### Body:
```json
{
  "from": "sender_phone_number",
  "to": "recipient_phone_number",
  "body": "Message content here",
  "metadata": {
    "custom": "optional fields"
  }
}
```

---

### 2️⃣ Send OTP

**POST** `/message/send-otp`

#### Headers:
```http
x-api-key: your_project_api_key
Content-Type: application/json
```

#### Body:
```json
{
  "phone": "recipient_phone_number",
  "purpose": "login_verification" // optional
}
```

> 💬 The OTP will be saved as a message in your MockSMS inbox.

---

### 3️⃣ Verify OTP

**POST** `/message/verify-otp`

#### Headers:
```http
x-api-key: your_project_api_key
Content-Type: application/json
```

#### Body:
```json
{
  "phone": "recipient_phone_number",
  "code": "812704"
}
```

---

## 🧾 Authentication (For Dashboard Routes)

- User login gives **access token** (used for API calls) and **refresh token** (stored in httpOnly cookie).
- APIs like `/projects` and `/message/:id` require login.
- External SMS APIs use only the **API key**, no login required.

---

## 📂 Folder Structure

```
mocksms/
├── client/       # Vite + React frontend
└── server/       # Node.js + Express backend
```

---

## 🛠️ Installation Guide

### 📦 Clone the Repo

```bash
git clone [https://github.com/your-username/mocksms.git](https://github.com/aditya241104/Mock-SMS/tree/main)
cd mocksms
```

---

### 🖥️ Frontend Setup (client)

```bash
cd client
```

#### 🧩 Add `.env`:
```env
VITE_BASE_URL=https://mock-sms-backend.onrender.com/api
```

#### 📦 Install Dependencies:
```bash
npm install
```

#### ▶️ Start Dev Server:
```bash
npm run dev
```

---

### 🔧 Backend Setup (server)

```bash
cd server
```

#### 🧩 Add `.env` (only the variables):
```env
PORT=
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRE=
JWT_REFRESH_EXPIRE=
```

#### 📦 Install Dependencies:
```bash
npm install
```

#### ▶️ Start Server:
```bash
# Using nodemon
nodemon index.js

# Or plain node
node index.js
```

---

## 📚 API Summary

| Function          | Method | Route                      | Auth Required | Notes                       |
|-------------------|--------|----------------------------|----------------|-----------------------------|
| Register/Login    | POST   | `/auth`                    | ❌             | Auth via JWT                |
| Get Projects      | GET    | `/project`                 | ✅             | Shows your projects         |
| Create Project    | POST   | `/project`                 | ✅             | Creates project + API key   |
| Delete Project    | DELETE | `/project/:id`             | ✅             | Deletes project & messages  |
| Send Message      | POST   | `/message/send`            | ❌ (API key)   | External SMS API            |
| Send OTP          | POST   | `/message/send-otp`        | ❌ (API key)   | External OTP API            |
| Verify OTP        | POST   | `/message/verify-otp`      | ❌ (API key)   | External OTP verification   |
| Delete Message    | DELETE | `/message/:id`             | ✅             | Manual deletion             |

---

## 🗑️ Message Expiry

- ⏳ **Auto-deleted after 24 hours**
- 🗑️ Manual deletion supported from the dashboard

---

## 💡 Future Ideas (V2)

- Real-time updates via WebSocket
- OTP attempt rate limiting
- Project-based webhooks
- OTP delivery simulation timeline
- Multi-user collaboration per project

---

## 👨‍💻 Built With

- Frontend: **React + Vite + TailwindCSS**
- Backend: **Node.js + Express**
- DB: **MongoDB (Mongoose)**
- Auth: **JWT (access + refresh token)**
- Deployment: **Render (backend) + Vercel (frontend)**
