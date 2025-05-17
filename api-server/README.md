# **Cryptocurrency Stats API Server**  
**Project Overview & Documentation**  

---

## **📌 Overview**  
This project involves building an **API server** that:  
1. Fetches cryptocurrency statistics from **CoinGecko API**  
2. Stores data in **MongoDB**  
3. Provides endpoints for accessing current stats and historical data  

---

## **🔧 Technologies Used**  
- **Backend**: Node.js, Express  
- **Database**: MongoDB (via Mongoose)  
- **External API**: [CoinGecko API](https://www.coingecko.com/en/api)  
- **Dev Tools**: Postman, Nodemon  

---

## **⚡ API Endpoints**  

### **Task 1 Endpoints**
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/store-stats` | POST | Fetches and stores crypto stats | None |
| `/api/delete-stats` | DELETE | Clears all stored data | None |

### **Task 2 Endpoints**  
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/api/stats` | GET | Get latest stats for a cryptocurrency | `coin=bitcoin` |


---

## **🔍 Postman Testing Guide**

### **1. Setup Collection**
1. Create new collection in Postman named "Crypto API"
2. Add environment variables:
   ```
   base_url = http://localhost:8000
   ```

### **2. Task 1 Tests**
**Store Stats:**
1. Create POST request to `{{base_url}}/api/store-stats`
2. No body/headers needed
3. Expected 201 response:
   ```json
   {
     "success": true,
     "message": "New hourly data stored"
   }
   ```

**Delete Stats:**
1. Create DELETE request to `{{base_url}}/api/delete-stats`
2. Expected 200 response:
   ```json
   {
     "success": true,
     "message": "Deleted 15 records"
   }
   ```

### **3. Task 2 Tests**  
**Get Current Stats:**
1. Create GET request to `{{base_url}}/api/stats`
2. Add query parameter:
   - Key: `coin`
   - Value: `bitcoin`
3. Expected 200 response:
   ```json
   {
     "coin": "bitcoin",
     "price": 42000,
     "marketCap": 824000000000,
     "24hChange": 1.5,
     "timestamp": "2023-11-20T14:30:00Z"
   }
   ```

**Get Historical Data:**
1. Create GET request to `{{base_url}}/api/stats/history`
2. Add query parameters:
   - `coin=ethereum`
   - `hours=24`
3. Expected 200 response:
   ```json
   {
     "coin": "ethereum",
     "data": [
       {
         "price": 2483.52,
         "timestamp": "2023-11-20T14:00:00Z"
       },
       {...}
     ]
   }
   ```

---

## **⚠ Common Issues & Solutions**  

### **Postman Testing Problems**
1. **"Cannot POST" error**:
   - Verify server is running (`npm run dev`)
   - Check terminal for errors
   - Ensure route is registered in `app.js`

2. **Empty responses**:
   - Confirm MongoDB connection
   - Check CoinGecko API rate limits

3. **Parameter errors**:
   - Ensure exact parameter names (`coin` not `coinId`)
   - Valid values: `bitcoin`, `ethereum`, `matic-network`

---

## **📂 Updated Project Structure**  
```
api-server/
├── controllers/
│   ├── cryptoController.js   # Task 1 logic
│   └── statsController.js    # Task 2 logic
├── routes/
│   ├── cryptoRoutes.js       # Task 1 routes
│   └── statsRoutes.js        # Task 2 routes
├── models/
│   └── CryptoStat.js         # Updated schema
└── services/
    └── aggregationService.js # Hourly logic
```

---

## **🚀 Deployment Ready**
1. **Environment Variables**:
   ```env
   COINGECKO_API_KEY=your_key
   MONGODB_URI=mongodb://localhost:27017/crypto
   ```

2. **Production Start**:
   ```bash
   npm install --production
   node app.js
   ```

---

## **🎯 Conclusion**  
✅ **Task 1 Complete**: Basic API with storage functionality  
✅ **Task 2 Complete**: Enhanced stats endpoints with historical data  
📊 **Ready for Extension**: Add NATS integration for Task 3  

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/YOUR_COLLECTION_ID)