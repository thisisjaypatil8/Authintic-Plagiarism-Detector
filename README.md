
# 🧠 Authintic: AI-Powered Plagiarism Detector & Guidance System

**Authintic** is a comprehensive, full-stack application designed to not only detect plagiarism but also **teach students how to fix it**.

It goes beyond simple detection by using a sophisticated, multi-layered approach:
1.  **Detection:** Identifies direct copy-paste and advanced paraphrasing using sentence-level semantic embeddings (Sentence-Transformers & FAISS).
2.  **Guidance:** Uses **Google Gemini Flash** to generate personalized, educational tips on how to rewrite plagiarized sections authentically.

---

## 🚀 Technology Stack

**Frontend**
- React (v18)
- Tailwind CSS
- Axios
- Chart.js (Visual Reports)

**Backend**
- Node.js & Express
- MongoDB (Mongoose)
- JWT (Authentication)
- Multer (File Uploads)

**NLP Microservice**
- Python 3.10+
- Flask
- **Sentence-Transformers** (Semantic Analysis)
- **FAISS** (High-speed Vector Search)
- **Google Gemini 1.5 Flash** (AI Guidance Engine)
- NLTK (Text Processing)

---

## ✨ Key Features

- **Dual-Mode Detection:**
    - **Fast Mode:** Quick TF-IDF analysis for rapid checks.
    - **Deep Mode:** Semantic embedding search for detecting paraphrased content.
- **AI-Powered Guidance:**
    - Instead of just flagging text, it explains *why* it's plagiarized.
    - Provides actionable tips (e.g., "Combine ideas from multiple sources", "Add your own analysis").
    - **Does NOT write the text for you** — it teaches you how to write.
- **Visual Reports:**
    - Interactive highlighted document view.
    - Overall similarity score and breakdown (Direct vs. Paraphrased).
    - Personalized improvement summary.

---

## 📁 Project Structure

```
plagiarism-detector-project/
├── backend/                # Node.js Express Server
│   ├── routes/             # API Routes (Auth, Documents)
│   ├── models/             # MongoDB Schemas
│   ├── .env                # Backend Config (Mongo, JWT)
│   └── server.js           # Entry Point
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI Components (VisualReport, GuidanceCard)
│   │   ├── pages/          # Pages (Dashboard, Home, Login)
│   │   └── services/       # API Integration
│
└── nlp-service/            # Python Flask Microservice
    ├── project/
    │   ├── guidance_engine.py # Gemini AI Integration
    │   ├── main.py            # API Endpoints
    │   └── ...
    ├── source_texts/       # Reference Corpus
    ├── .env                # NLP Config (Gemini API Key)
    ├── preprocess_sources.py # Vector Indexing Script
    └── run.py              # Entry Point
```

---

## ⚙️ Setup and Installation

You’ll need **three separate terminals** open — one for each service.

### 🧩 Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB Atlas** account
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com))

---

### 🧠 Step 1: Set Up the NLP Service (Terminal 1)

> ⚠️ Set this up **first** to generate required data files.

1.  **Navigate to the directory:**
    ```bash
    cd nlp-service
    ```

2.  **Create and activate virtual environment:**
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment:**
    Create a `.env` file in `nlp-service/` and add your key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

5.  **Prepare Data:**
    *   Create a folder named `source_texts`.
    *   Add reference `.txt` files inside it.
    *   Run the preprocessor:
        ```bash
        python preprocess_sources.py
        ```

6.  **Start the Service:**
    ```bash
    python run.py
    ```
    *Runs at http://localhost:5001*

---

### 🔧 Step 2: Set Up the Backend (Terminal 2)

1.  **Navigate to directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in `backend/`:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Start the Server:**
    ```bash
    node server.js
    ```
    *Runs at http://localhost:5000*

---

### 💻 Step 3: Set Up the Frontend (Terminal 3)

1.  **Navigate to directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the App:**
    ```bash
    npm start
    ```
    *Opens at http://localhost:3000*

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🪪 License

MIT License — Free for personal and educational use.

---

### 💡 Developed by [Jay Patil](https://github.com/thisisjaypatil8), [Prathmesh Mohite](https://www.linkedin.com/in/prathameshmohite1856/), [Viraj Kamble](https://www.linkedin.com/in/virajkamble0706/), [Harsh Pardeshi](https://www.linkedin.com/in/harsh-pardeshi-4ab64127b/)
