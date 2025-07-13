#  **Project Overview & Learnings** 

---
This project is a **Node.js backend system** that:  
- Fetches real-time cryptocurrency data (Bitcoin, Ethereum, Matic) from **CoinGecko API**  
- Stores data in **MongoDB** with automated scheduling  
- Provides REST APIs for price analysis  
- Uses **NATS messaging** for inter-service communication  

**Key Features**:  
✅ Automated data collection  
✅ Price deviation analytics  
✅ Event-driven architecture  

---

## **⚠️ Challenges & Solutions**  

### **1. MongoDB Duplicate Documents**  
**Issue**:  
- Initial implementation created new documents on every fetch → DB bloating  
- 100 API calls = 300 duplicate documents (3 coins × 100 entries)  

**Possible solutions to be Implemented**:  
```javascript
// 1. Upsert Mechanism (Update existing records)
await CryptoStat.updateOne(
  { coinId: 'bitcoin', hour: currentHour },
  { $set: { price: latestPrice } },
  { upsert: true }
);

// 2. Scheduled Cleanup (Daily)
db.cryptostats.deleteMany({ 
  timestamp: { $lt: new Date(Date.now() - 30*24*60*60*1000) } 
});
```

### **2. Docker & NATS Issues**  
**Problems Faced**:  
- `CONNECTION_REFUSED` errors when NATS wasn't running  
- Docker permissions on Linux (`Cannot connect to Docker daemon`)  

**Debugging Steps**:  
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Verify NATS connection
docker run -p 4222:4222 nats:latest
nats-sub crypto.updates
```

---

## **💡 Key Learnings**  

### **1. NATS Messaging**  
- Pub/Sub pattern for decoupled services  
- Message persistence strategies  
- Connection error handling:  
  ```javascript
  nats.connect().on('error', (err) => {
    console.error('NATS error:', err);
  });
  ```

### **2. Node Scheduling**  
- Implemented cron-like jobs with `node-schedule`:  
  ```javascript
  schedule.scheduleJob('*/15 * * * *', fetchAndPublish);
  ```
- Learned about:  
  - Job prioritization  
  - Missed event recovery  

### **3. Crypto Data Modeling**  
- Optimized MongoDB schema:  
  ```javascript
  const cryptoSchema = new Schema({
    coinId: { type: String, enum: ['bitcoin', 'ethereum', 'matic-network'] },
    price: { type: Number, index: true },
    timestamp: { type: Date, expires: '30d' } // Auto-expire
  });
  ```
- Trade-offs:  
  - Precision vs storage costs  
  - Historical vs real-time data needs  

---

## **🚀 Setup Guide**  

### **1. Start Services**  
```bash
# NATS (message broker)
docker run -p 4222:4222 nats:latest

# API Server
cd api-server
npm install
npm run dev

# Worker (background jobs)
cd worker-server 
npm install
node index.js
```

### **2. Test Endpoints**  
```bash
# Trigger data fetch
curl -X POST http://localhost:3000/api/store-stats

# Get deviation analytics
curl "http://localhost:3000/api/deviation?coin=bitcoin"
```

---

## **Conclusion**  
This project deepened my understanding of:  
- **Event-driven architectures** (NATS)  
- **Database optimization** for time-series data  
- **Robust error handling** in Node.js  


  
