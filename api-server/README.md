# Cryptocurrency Stats API Server  

## 📌 Overview  
This project involves building an **API server** that:  
1. Fetches cryptocurrency statistics from **CoinGecko API**  
2. Stores data in **MongoDB**  
3. Provides endpoints for:  
   - Real-time stats  
   - Historical data  
   - Price deviation analytics  
4. Uses **NATS messaging** for event-driven updates  

---

## 🔧 Technologies Used  
| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Messaging | NATS (with Docker) |
| External API | CoinGecko API |
| Dev Tools | Postman, Nodemon |

---

## ⚡ API Endpoints  

### **Core Endpoints**
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/store-stats` | POST | Fetches and stores crypto stats | None |
| `/api/stats` | GET | Get latest stats | `coin=bitcoin` |
| `/api/deviation` | GET | Calculate price deviation | `coin=bitcoin` |
|  `/api/delete-stats` | DELETE | Clear DB |
### **Task 1: Data Collection & Storage**  
- **Goal**: Fetch and store crypto stats (Bitcoin, Ethereum, Matic)  
- **Components**:  
  - `POST /api/store-stats`: Fetches from CoinGecko API → Saves to MongoDB  
  - `DELETE /api/delete-stats`: Cleans up old data  
- **Key Logic**:  
  ```javascript
  // Pseudocode
  fetchFromCoinGecko() 
    → saveToMongoDB()
  ```

### **Task 2: Stats API**  
- **Goal**: Retrieve stored data  
- **Endpoints**:  
  - `GET /api/stats?coin=bitcoin`: Latest stats  
  - `GET /api/stats/history?coin=ethereum&hours=24`: Historical data  
- **Response**:  
  ```json
  {
    "price": 42000,
    "marketCap": 824000000000,
    "24hChange": 1.5
  }
  ```

### **Task 3: Deviation Analysis**  
- **Goal**: Calculate price volatility  
- **Endpoint**:  
  `GET /api/deviation?coin=bitcoin`  
- **Calculation**:  
  ```javascript
  // Standard deviation of last 100 prices
  stdDev([40000, 45000, 50000]) → 4082.48
  ```

---

### **Setup Instructions**  

#### **1. Clone & Prepare**  
```bash
git clone https://github.com/LikhithPalya/KoinX-assignment.git
cd api-server
```

#### **2. Configure Environment**  
```bash
# API Server
echo "MONGODB_URI=<mongodb uri>" > api-server/.env
echo "COINGECKO_API_KEY=your_key_here" >> api-server/.env

# Worker Server
echo "NATS_URL=nats://localhost:4222" > worker-server/.env
```

#### **3. Start Services**  
| Service | Command | Port |
|---------|---------|------|
| **NATS** | `docker run -p 4222:4222 nats:latest` | 4222 |
| **API Server** | `cd api-server && npm install && npm run dev` | 3000 |
| **Worker** | `cd worker-server && npm install && node index.js` | - |

#### **4. Verify**  
```bash
# Check API
curl http://localhost:3000/api/stats?coin=bitcoin

```

---

### **Architecture Flow**  
1. **Worker** (every 15 min):  
   `CoinGecko → NATS → API Server → MongoDB`  
2. **API Server**:  
   `MongoDB ←→ /stats & /deviation APIs`  

---

### **Troubleshooting**  
- **NATS Not Connecting**:  
  ```bash
  docker ps  # Check if NATS container is running
  ```
- **Empty API Responses**:  
  ```bash
  mongosh "mongodb://localhost:27017/crypto" --eval "db.cryptostats.countDocuments()"
