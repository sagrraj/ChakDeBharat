# 🛡️ Technical Setup Cheat Sheet

To make your demo work seamlessly, follow these steps to link the code I wrote with your AWS account.

## 1. DynamoDB (Persistent Memory)
- **Table Name**: `VaaniCallerProfiles`
- **PK**: `PhoneNumber` (S)
- **Sample Data**:
  ```json
  {
    "PhoneNumber": "+91XXXXXXXXXX",
    "Name": "Rahul Sharma",
    "Notes": "Frequent orderer of heart meds",
    "LastCallSummary": "Inquiry about delivery"
  }
  ```

## 2. AWS Lambda (Action Provider)
- Upload `backend/handler.js`.
- **Environment Variables**: None needed (uses standard AWS SDK).
- **IAM Policy**: Ensure the role has `dynamodb:GetItem` and `dynamodb:PutItem`.

## 3. Amazon Bedrock Agent
- **Instructions**: "You are Vaani, a multilingual AI for a small business. Your first priority is identifying callers via their phone number and being helpful in Hinglish."
- **Functions to Register**:
  - `get_customer_profile`: Input `phoneNumber` → Returns Name/Notes.
  - `update_call_summary`: Input `summary` → Saves call outcome.

## 4. Connecting the Dashboard to AWS (The Demo Loop)
To make your Local Dashboard show "Real" data:
1. In `App.jsx`, replace the `activeCalls` hardcoded state with a `fetch` call to a simple API Gateway that triggers your Lambda.
2. *Alternatively* (Faster for Hackathon): Just have a "Mock Live Call" button on the dashboard that simulates the state change when you start your phone demo.

## 💡 Pitch Script for Judges
**You**: "Judges, notice how Vaani didn't ask for my name. It *already knew it* from the DynamoDB profile. And when I spoke in Hinglish, it didn't translate into English logic—it processed it natively."
**Judges**: "How does the owner see this?"
**You**: (Point to Dashboard) "Arpita Pharmacy gets a live breakdown of the AI's thoughts and a customer memory update in real-time."
