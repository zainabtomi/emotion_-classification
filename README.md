# emotion_-classification
# Arabic Emotion Analysis Platform

A comprehensive platform for Arabic emotion analysis, built using:

- Backend: Node.js + Express  
- Frontend: React + Vite  
- Model Training: AraBERT  
- Dataset: Folder for raw and processed text data

Project Structure:
project-root/
├── emotion-backend/       - RESTful API (Node.js)
├── emotion-frontend/      - User Interface (React)
├── model-training/        - Model Training Scripts (AraBERT)
├── dataset/               - Arabic text data for training and evaluation

How to Run:

1. Start the Backend:
   cd emotion-backend
   npm install
   cp .env.example .env
   node server.js

2. Start the Frontend:
   cd emotion-frontend
   npm install
   npm run dev

3. Train the Model:
   cd model-training
   pip install -r requirements.txt
   python train.py

Notes:
- The dataset/ folder contains both raw and cleaned data.
- API documentation is available at emotion-backend/docs/api.md.
- The system supports:
  - JWT-based user authentication
  - Arabic emotion classification
  - Admin dashboard for user and data management


