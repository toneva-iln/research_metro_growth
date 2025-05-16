# Zillow Forecast MicroSaaS

This is a containerized web application built with **FastAPI** (backend) and **React** (frontend), designed to visualize and filter Zillow housing market prediction data by state and timeframe.

> 📝 *I created this app for personal use to assist with real estate trend analysis and research.*

---

## 🚀 Features

* Parses Zillow prediction CSV data in real time
* Filters results by state and price trend thresholds
* Sortable table UI with a sleek dark theme
* Containerized backend and frontend services via Docker Compose

---

## 🧰 Tech Stack

* **Backend:** Python, FastAPI, Pandas
* **Frontend:** React, Material UI, Nginx (for static hosting)
* **Containerization:** Docker, Docker Compose

---

## 🐳 Running the App with Docker

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zillow-forecast-micro-saas.git
cd zillow-forecast-micro-saas
```

### 2. Build and run the containers

```bash
docker-compose up --build
```

### 3. Access the application

* Frontend (UI): [http://localhost:3000](http://localhost:3000)
* Backend (API): [http://localhost:8000](http://localhost:8000)

> Note: The frontend queries the backend using the service name `backend` inside the Docker network.

---

## 🗂 Project Structure

```
.
├── backend/              # FastAPI app (main.py, requirements.txt, etc.)
├── frontend/             # React app (src/, public/, package.json, etc.)
├── docker-compose.yml    # Compose config to run full stack
└── README.md
```

---

## 🧪 Development Tips

* You can run `docker-compose down` to stop and remove all containers.
* Use `.dockerignore` to prevent unnecessary files from being copied into the image.

---

## 📬 Feedback

If you found this useful or have suggestions, feel free to reach out or fork the repo!
