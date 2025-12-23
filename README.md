# **TinyLink – URL Shortener (MERN + JWT + Analytics)**  
A fast, secure, and modern URL shortening platform with user authentication, link tracking, and a polished UI.

🔗 **Live Demo:** https://link-shortner-liard.vercel.app/  
📦 **Backend API:** _(add your backend link if deployed)_

---

## 🚀 Features
- Create short, unique URLs instantly  
- JWT-based authentication (Register/Login)  
- Dashboard to manage your links  
- Click analytics (track number of visits)  
- Copy-to-clipboard  
- Responsive UI (TailwindCSS + React)  
- Secure redirects with server-side validation  

---



## 🛠️ Tech Stack

### **Frontend**
- React.js  
- React Router  
- Tailwind CSS  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- NanoID (for generating short IDs)

### **Deployment**
- Vercel (Frontend)  
- Railway / Render / Cyclic (Backend)

---

## 📌 How It Works
1. User logs in or registers  
2. Pastes a long URL  
3. System generates a unique short code  
4. Redirect server checks:  
   - URL validity  
   - Expiration (if added)  
   - Updates analytics  
5. User views analytics in dashboard  

---

## 🔧 Run Locally

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/YOUR_USERNAME/tinylink.git
cd tinylink
```

### 2️⃣ Install dependencies  
```bash
npm install
```

### 3️⃣ Start frontend  
```bash
npm run dev
```

### 4️⃣ Start backend  
```bash
cd backend
npm install
npm start
```

---

## 🔐 Environment Variables  
Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---

## 🤝 Contributing  
Pull requests are welcome. If you find a bug or have suggestions, open an issue.

---

## 📄 License  
MIT License.

---

## 👤 Author  
**Adesh Gaurav**  
- LinkedIn: https://www.linkedin.com/in/adeshgaurav/  
- GitHub: https://github.com/Adesh344  
