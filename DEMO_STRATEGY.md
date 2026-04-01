# VaaniAI Hackathon Demo Strategy & Setup

VaaniAI is an agentic voice system. To win, show the **full loop** from the customer's phone call to the business owner's WhatsApp summary and real-time dashboard.

## 🚀 The Demo Flow (Show This to Judges!)

1.  **Phase 1: The Call (Hinglish Support)**
    - Call the Amazon Connect number.
    - **Script**: "Bhai mera kal wala order kahan hai? Name is Rahul."
    - **Vaani's Logic**: The Agent uses `get_customer_profile` (Logic in `handler.js`) to find "Rahul", checks the knowledge base for "Shipping Policy", and replies in Hinglish.
    - **Judge's Wow**: The AI already knew the name "Rahul" from the persistent DynamoDB memory.

2.  **Phase 2: Real Action**
    - **Script**: "Can you please issue a refund for my order #12345? Medicine expiry ho chuka hai."
    - **Vaani's Logic**: The Agent triggers the `Refund` action group.
    - **Judge's Wow**: This isn't just a chatbot; it's an **Agent** taking actions in a real database.

3.  **Phase 3: The Dashboard (The "Hub")**
    - Show the **VaaniAI Business Dashboard** (in `frontend/`).
    - Explain: "While Arpita was working, a live transcript and sentiment appeared on her screen. She didn't even have to pick up the phone."

4.  **Phase 4: WhatsApp Closure**
    - Show the WhatsApp message: "Hi Arpita, Rahul Sharma called. Order #12345 refunded due to medicine expiry. Summary: resolved."
    - **Judge's Wow**: 360-degree integration.

---

## ⚙️ AWS Quick Setup (How to Connect the Files)

### 1. Amazon Bedrock Agent
- Create an Agent named "Vaani".
- **Instruction**: "You are an AI support agent for a pharmacy/kirana. Always check the caller's profile at the start of a call. Speak in Hinglish or the language the caller uses."
- **Action Group**: Point it to the `backend/handler.js` Lambda. Define functions: `get_customer_profile`, `update_call_summary`, `check_order_status`.

### 2. Amazon DynamoDB
- Table Name: `VaaniCallerProfiles`
- PK: `PhoneNumber` (S).
- Sample Item: `{ PhoneNumber: "+91...", Name: "Rahul Sharma", LastCallSummary: "Inquired about order" }`.

### 3. Amazon Connect
- **Contact Flow**:
    - `Set Voice`: Kajal (Hindi) or Aditi (English).
    - `Set Language`: Hinglish (via Amazon Transcribe).
    - Use the `Contact Bedrock Agent` block to pass the caller's phone number as a session attribute.

## 💻 Running the Dashboard Locally

```bash
cd frontend
npm install
npm run dev
```
Explore the glassmorphic dashboard at `localhost:5173`.
