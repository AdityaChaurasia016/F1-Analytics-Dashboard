# 🏎️ Formula 1 Analytics Dashboard

An interactive data visualization tool built with **Flask (backend)** and **React (frontend)** to analyze and compare Formula 1 driver stats and career performance.

## 🚀 Features

- Preprocessed race data using Python and Google Colab
- Interactive graphs for driver comparisons and race metrics
- Career insights like podium finishes, pole positions, and total points
- Dockerized setup using `docker-compose` for easy deployment

## 🛠️ Tech Stack

- **Frontend:** React, Chart.js (or D3.js if used)
- **Backend:** Flask, Pandas, REST API
- **Deployment:** Docker, Docker Compose
- **Data Processing:** Google Colab (Python)

## 📦 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/AdityaChaurasia016/F1-Analytics-Dashboard.git
cd F1-Analytics-Dashboard

# Build and run with Docker
docker-compose up --build
