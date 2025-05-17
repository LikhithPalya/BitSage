# **Task 1: Crypto Stats API Server**  
**Project Overview & Documentation**  

---

## **📌 Overview**  
This project involves building an **API server** that fetches cryptocurrency statistics (Bitcoin, Ethereum, Matic Network) from the **CoinGecko API** and stores them in **MongoDB**.  

### **Key Features**  
✅ **Fetches real-time crypto data** (price, market cap, 24h change)  
✅ **Stores data in MongoDB** for historical tracking  
✅ **REST API endpoints** for triggering data storage & retrieval  
✅ **Scalable architecture** (modular routes, controllers, models)  

---

## **🔧 Technologies Used**  
- **Backend**: Node.js, Express  
- **Database**: MongoDB (via Mongoose)  
- **External API**: [CoinGecko API](https://www.coingecko.com/en/api)  
- **Dev Tools**: Postman (API testing), Nodemon (live reload)  

---

## **⚡ API Endpoints**  

| **Endpoint**         | **Method** | **Description**                                      |
|----------------------|------------|------------------------------------------------------|
| `/api/store-stats`   | `POST`     | Fetches latest crypto stats & stores in DB           |
| `/api/stats/:coinId` | `GET`      | Gets historical stats for a specific coin (e.g., `bitcoin`) |
| `/api/delete-stats`         | `DELETE`   | (Optional) Clears all stored data                    |

---

## **⚠ Problems Faced & Solutions**  

### **1️⃣ Problem: Duplicate Database Entries**  
**Issue:**  
- Every API call to `/store-stats` creates **new documents** in MongoDB.  
- Example: 100 API calls → 300 documents (3 coins × 100 entries).  
- **Database becomes cluttered** with redundant data.  

**Possible Solutions:**  

| **Solution**                | **Pros**                          | **Cons**                          |
|-----------------------------|-----------------------------------|-----------------------------------|
| **1. Upsert (Update or Insert)** | ✅ No duplicates, always latest data | ❌ Loses historical fluctuations |
| **2. Hourly Aggregation**   | ✅ Tracks hourly trends efficiently | ❌ Needs scheduled jobs |
| **3. Capped Collections**   | ✅ Auto-deletes old records | ❌ Fixed size, no flexibility |
| **4. Manual Cleanup Script** | ✅ Full control over data retention | ❌ Requires maintenance |

### **2️⃣ Problem: CoinGecko API Rate Limits**  
**Issue:**  
- Free tier allows **~50 requests/minute**.  
- Frequent polling can lead to **rate-limiting errors (429)**.  

**Solution:**  
- **Cache responses** (store data hourly instead of real-time).  
- **Use exponential backoff** for retries.  
- **Optional:** Upgrade to a paid CoinGecko plan.  

---

## **🚀 Recommended Solution: Hourly Aggregation**  
Since crypto prices can **change abruptly**, storing **hourly snapshots** is better than daily data.  

### **How It Works**  
1. **Check if hourly data already exists** for the current hour.  
2. **If not, store new data**; otherwise, skip.  
3. **Optional:** Keep a separate collection for **high-frequency data** (if needed).  

### **Implementation Code**  
```javascript
// In your controller
const storeCryptoStats = async () => {
  const now = new Date();
  const currentHour = new Date(now);
  currentHour.setMinutes(0, 0, 0); // Round to current hour

  // Check if data already exists for this hour
  const existingData = await CryptoStat.findOne({
    coinId: "bitcoin",
    timestamp: { $gte: currentHour }
  });

  if (existingData) {
    return { success: true, message: "Hourly data already stored" };
  }

  // Else, fetch and store new data
  const stats = await fetchCryptoStats();
  await CryptoStat.insertMany(stats);
  
  return { success: true, message: "New hourly data stored" };
};
```

---

## **📂 Project Structure**  
```
api-server/
├── .env
├── app.js (Main server setup)
├── routes/
│   └── cryptoRoutes.js (API endpoints)
├── controllers/
│   └── cryptoController.js (Business logic)
├── models/
│   └── CryptoStat.js (MongoDB schema)
└── utils/
    └── coinGecko.js (CoinGecko API helper)
```

---

## **🔍 How to Test?**  
1. **Start the server:**  
   ```bash
   npm run dev
   ```
2. **Store new stats:**  
   ```bash
   curl -X POST http://localhost:8000/api/store-stats
   ```
3. **Retrieve stored stats:**  
   ```bash
   curl http://localhost:8000/api/stats
   ```

---

## **🔜 Future Improvements**  
- **Add authentication** (JWT/OAuth)  
- **Implement WebSocket** for real-time price updates  
- **Deploy on AWS/Heroku**  

---

## **🎯 Conclusion**  
This project successfully **fetches, stores, and retrieves** crypto stats. The **hourly aggregation** approach ensures **optimal database usage** while keeping valuable market trends.  

**Next Steps:**  
- [ ] Implement hourly data storage  
- [ ] Set up automated cleanup for old records  
- [ ] Add more coins if needed  

🚀 **Happy Coding!** 🚀