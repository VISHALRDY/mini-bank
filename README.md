# 🏦 MiniBank – Full Stack Banking Application

A full-stack banking simulation app where users can create accounts, deposit money, withdraw money, and view transaction history.  
This project demonstrates **REST API development**, **MongoDB schema design**, **business logic**, and **full deployment** on Render + Netlify.

---

## 🚀 Live Demo

### 🔹 Frontend (Netlify)  
👉 **https://minibank1.netlify.app/**

### 🔹 Backend API (Render)  
👉 **https://mini-bank-jeds.onrender.com/**

---

## 📌 Features

### 🧑‍💼 Account Management
- Create new bank accounts  
- Auto-generated unique account numbers  
- Initial deposit support  
- Real-time balance updates  

### 💰 Transactions
- Deposit money  
- Withdraw money (with validation for insufficient balance)  
- Transaction history linked to each account  
- Color-coded UI (green = deposit, red = withdrawal)  

### 📊 Dashboard
- View all accounts  
- Select an account to see full details  
- Transaction table with:
  - Type  
  - Amount  
  - Description  
  - Timestamp  

### 🌐 Deployment
- Backend → **Render**  
- Frontend → **Netlify**  
- Database → **MongoDB Atlas**

---

## 🛠 Tech Stack

### **Frontend**
- HTML  
- CSS  
- JavaScript (Fetch API)  
- Responsive UI  

### **Backend**
- Node.js  
- Express.js  
- Mongoose  
- CORS enabled  

### **Database**
- MongoDB Atlas  
- Collections:
  - `accounts`
  - `transactions`

### **Hosting**
- Render (Backend)  
- Netlify (Frontend)

---

## 📡 API Endpoints

### **Accounts**

#### ➕ Create Account  
