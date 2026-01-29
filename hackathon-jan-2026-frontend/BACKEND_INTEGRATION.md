# Backend Integration Guide 🔌

## Overview
This guide walks you through integrating the Spring Boot backend (OTJ Logger) with your React frontend.

---

## Step-by-Step Integration Process

### ✅ Step 1: Clone the Backend Repository ✅ COMPLETED

~~Open a **new terminal** (keep your frontend terminal running) and execute:~~

```bash
# Navigate to your project folder
cd "/Users/book.seenonmuang/Apprenticeship Folder/Hackathon 2026"

# Clone the backend
git clone https://github.com/YWS01/winter-hackathon-back-end.git

# Enter the backend directory - NOTE: The actual project is in the otj-logger subfolder!
cd winter-hackathon-back-end/otj-logger
```

**✅ STATUS: Backend repository cloned successfully**

---

### ✅ Step 2: Install Backend Prerequisites

Based on the backend README, you need:

1. **Java 17+** - Check if you have it:
   ```bash
   java -version
   ```
   If not installed, download from: https://adoptium.net/

2. **Maven** - Check if you have it:
   ```bash
   mvn -version
   ```
   If using the bundled wrapper, you can skip this.

---

### ✅ Step 3: Build and Run the Backend ✅ COMPLETED

**IMPORTANT:** Maven is not installed globally, so use the Maven wrapper (`./mvnw`) instead!

```bash
# Navigate to the otj-logger subfolder (the actual Spring Boot project)
cd "/Users/book.seenonmuang/Apprenticeship Folder/Hackathon 2026/winter-hackathon-back-end/otj-logger"

# Build the project (skip tests for faster build) using wrapper
./mvnw -DskipTests package

# Run the Spring Boot application using wrapper
./mvnw spring-boot:run
```

**Expected output:**
- Server starts at: `http://localhost:8081`
- You should see: "Started OTJ Logger Application" or similar

**Keep this terminal running!** The backend needs to stay active while you develop.

---

### ✅ Step 4: Frontend Configuration (Already Done!)

I've already created the following files for you:

#### ✨ New Files Created:

1. **`src/services/api.js`** - API service layer
   - Contains all backend API calls
   - Handles errors gracefully
   - Configurable base URL

2. **Environment Configuration**
   You need to create a `.env` file manually (it's in `.gitignore`):
   
   ```bash
   # In your frontend directory
   cd hackathon-jan-2026-frontend
   echo "VITE_API_URL=http://localhost:8081" > .env
   ```

#### ✨ Updated Files:

1. **`src/components/LearningJournal.jsx`**
   - Now fetches entries from backend on load
   - Saves new entries to backend
   - Shows loading and error states

---

### ✅ Step 5: Test the Integration

1. **Restart your frontend dev server** (to load the new `.env` file):
   ```bash
   # Press Ctrl+C in your frontend terminal, then:
   npm run dev
   ```

2. **Visit** `http://localhost:5174/` (or your Vite port)

3. **What to expect:**
   - If backend is running: You'll see entries from the database
   - If backend is NOT running: You'll see an error message

4. **Test creating an entry:**
   - Click "+ Add New Entry"
   - Fill in the form
   - Click "Save Entry"
   - Check if it appears in the timeline

---

## Backend API Endpoints Reference

Based on a typical Spring Boot OTJ Logger, these endpoints should be available:

### OTJ Entries
- `GET /api/otj-entries` - Get all entries
- `GET /api/otj-entries/{id}` - Get entry by ID
- `POST /api/otj-entries` - Create new entry
- `PUT /api/otj-entries/{id}` - Update entry
- `DELETE /api/otj-entries/{id}` - Delete entry
- `GET /api/otj-entries/total-hours` - Get total hours

### KSBs (Knowledge, Skills, Behaviours)
- `GET /api/ksbs` - Get all KSBs
- `GET /api/ksbs/{id}` - Get KSB by ID
- `POST /api/ksbs` - Create new KSB
- `GET /api/ksbs/type/{type}` - Get KSBs by type

---

## Troubleshooting Common Issues

### ❌ Problem: "Failed to load entries"

**Cause:** Backend is not running or using a different port

**Solutions:**
1. Check backend terminal - is it running?
2. Check the port: `http://localhost:8081`
3. Check browser console for CORS errors
4. Verify `.env` file has correct URL

---

### ❌ Problem: CORS Errors

**Cause:** Spring Boot blocking requests from frontend

**Solution:** Check backend has CORS configuration. It should have something like:
```java
@CrossOrigin(origins = "http://localhost:5174")
```

If not, you may need to add this to the backend controllers.

---

### ❌ Problem: "Cannot find module '../services/api'"

**Cause:** Missing API service file

**Solution:** Make sure `src/services/api.js` exists (I created it for you)

---

### ❌ Problem: Data format mismatch

**Cause:** Frontend expects different field names than backend

**Solution:** Check what the backend actually returns:
1. Open browser DevTools
2. Go to Network tab
3. Create an entry
4. Check the response format
5. Update the API service if needed

---

## Next Steps (Future Enhancements)

### 🔜 Features to add:

1. **Delete entries** - Add delete functionality
   ```javascript
   const handleDeleteEntry = async (id) => {
     await otjApi.deleteEntry(id);
     loadEntries(); // Refresh list
   };
   ```

2. **Edit entries** - Add update functionality
3. **KSB integration** - Connect KSB selector to backend
4. **Document upload** - Integrate file upload with backend
5. **Search/Filter** - Add search functionality
6. **Pagination** - Handle large datasets

---

## Development Workflow

**Daily workflow:**

1. Start backend:
   ```bash
   cd winter-hackathon-back-end
   mvn spring-boot:run
   ```

2. Start frontend (in separate terminal):
   ```bash
   cd hackathon-jan-2026-frontend
   npm run dev
   ```

3. Develop and test!

---

## Quick Reference Commands

```bash
# Backend
cd winter-hackathon-back-end
mvn spring-boot:run              # Run backend
mvn clean package -DskipTests    # Rebuild

# Frontend
cd hackathon-jan-2026-frontend
npm run dev                      # Run dev server
npm run build                    # Build for production
npm run test                     # Run tests

# Both running simultaneously (different terminals)
Terminal 1: Backend on :8081
Terminal 2: Frontend on :5174
```

---

## Architecture Overview

```
┌─────────────────┐         HTTP          ┌─────────────────┐
│                 │  ───────────────────>  │                 │
│  React Frontend │                        │  Spring Boot    │
│  (Port 5174)    │  <───────────────────  │  Backend        │
│                 │       JSON/REST        │  (Port 8081)    │
└─────────────────┘                        └─────────────────┘
                                                    │
                                                    │ JPA
                                                    ▼
                                           ┌─────────────────┐
                                           │   H2 Database   │
                                           │   (in-memory)   │
                                           └─────────────────┘
```

---

## Success Checklist ✅

- [ ] Backend cloned from GitHub
- [ ] Java 17+ installed
- [ ] Backend runs successfully on port 8081
- [ ] Frontend `.env` file created
- [ ] Frontend dev server restarted
- [ ] Can see "Loading entries..." on page load
- [ ] Can create new entries and see them saved
- [ ] No CORS errors in browser console

---

## Need Help?

1. **Check backend logs** - Look for errors in the terminal running Spring Boot
2. **Check browser console** - Press F12 and look for errors
3. **Check Network tab** - See what requests are being made
4. **Verify backend is responding** - Visit `http://localhost:8081/api/otj-entries` directly in browser

Good luck with your hackathon! 🚀
