# PupilShield

PupilShield is a full-stack, responsive and accessible school vaccination portal built using the MERN stack. It allows schools to manage student records, track vaccination drives, and generate reports.

---

## 🛠 Technologies Used

### Frontend (`/frontend`)

* **React**
* **Vite**
* **MUI (Material UI)**

### Backend (`/backend`)

* **Node.js**
* **Express.js**
* **MongoDB** (via **Mongoose**)
* **Multer** (for CSV upload)
* **json2csv** (for exporting reports)
* **dotenv**

---

## 🔁 Frontend-Backend Integration

The React frontend communicates with the Express backend via RESTful APIs. Axios is used for API requests, and data is stored in MongoDB. Students and vaccination drives are managed through endpoints served on `http://localhost:5002`.

---

## 📦 Setup Instructions

### 1. Download and Unzip

* Download the zipped project folder.
* Unzip it to your local machine.

### 2. Open Two Terminals

#### Terminal 1: Frontend

```bash
cd frontend
npm install
npm run dev
```

This starts the React frontend at `http://localhost:5173/`

#### Terminal 2: Backend

```bash
cd backend
npm install
npm run dev
```

This starts the Express backend server at `http://localhost:5002/`

> **Note:** Ensure MongoDB is running locally on default port.

### 3. Login Credentials

* **Username:** `admin`
* **Password:** `password`

---

## 🌟 Features

* Add/Edit/Delete students with modals
* Bulk import students via CSV
* Add/Edit/Delete vaccination drives
* Mark students vaccinated per drive
* Generate vaccination reports with filters
* Download reports as CSV
* Authentication simulation with login/logout
* Responsive layout with mobile support
* Accessible UI components using MUI

---

## 📎 Access the App

Visit: [http://localhost:5173/](http://localhost:5173/) once both frontend and backend servers are running.

Login to access the dashboard. From there, navigate to Students, Drives, and Reports.

---

> Created by **Utkarsh Katiyar** ([2024tm93147@wilp.bits-pilani.ac.in](mailto:2024tm93147@wilp.bits-pilani.ac.in))
> For **Full Stack Application Development** assignment
