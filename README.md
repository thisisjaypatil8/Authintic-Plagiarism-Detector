
# 🧠 Authintic: AI-Powered Plagiarism Detector & Guidance System

**Authintic** is a comprehensive, full-stack web application designed to not only detect plagiarism but also **teach students how to fix it**.

It goes beyond simple detection by using a sophisticated, multi-layered approach:
1.  **Detection:** Provides 3 Layer Detection System which identifies direct copy-paste and advanced paraphrasing using sentence-level semantic embeddings (Sentence-Transformers & FAISS).
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
- **Fine-tuned BERT** (AI-Paraphrased Text Classification — F1: 0.9935)
- **Google Gemini 1.5 Flash** (AI Guidance Engine)
- SpaCy (Text Processing)

---

## ✨ Key Features

- **Dual-Mode Detection:**
    - **Fast Mode:** Quick TF-IDF analysis for rapid checks.
    - **Deep Mode:** Three-layer cascade — TF-IDF → FAISS semantic search → Fine-tuned BERT classifier (trained on PAN 2025 dataset, **F1-Score: 0.9935**, Precision: 0.997).
- **AI-Powered Guidance:**
    - Instead of just flagging text, it explains *why* it's plagiarized.
    - Provides actionable tips (e.g., "Combine ideas from multiple sources", "Add your own analysis").
    - **Does NOT write the text for you** — it teaches you how to write.
- **Visual Reports:**
    - Interactive highlighted document view with color-coded flags (Direct Match, Paraphrased, AI-Paraphrased).
    - Overall similarity score and breakdown.
    - Personalized improvement summary powered by Gemini AI.
- **User Authentication:** Secure JWT-based registration and login.
- **Modern UI:** Premium, responsive interface with teal accent theme, smooth animations and micro-interactions.

---

## 📁 Project Structure

```
Authintic-Plagiarism-Detector/
├── backend/                    # Node.js Express Server
│   ├── middleware/             # Auth middleware (JWT verification)
│   ├── models/                # MongoDB Schemas (User)
│   ├── routes/                # API Routes (Auth, Documents)
│   ├── uploads/               # Temporary file upload directory
│   ├── .env                   # Backend config (MongoDB URI, JWT secret)
│   └── server.js              # Entry point
│
├── frontend/                   # React Application
│   ├── public/                # Static assets (logo, team photos, tech logos)
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   │   ├── about/         # About page (TeamSection, TechStackSection)
│   │   │   ├── auth/          # Auth components (FormInput, PasswordInput, AuthButton)
│   │   │   ├── common/        # Shared components (ErrorBoundary)
│   │   │   ├── dashboard/     # Dashboard components (FAQSection)
│   │   │   ├── home/          # Home page (HeroSection, ProblemSection, SolutionSection)
│   │   │   ├── AnalysisReport.js
│   │   │   ├── DoughnutChart.js
│   │   │   ├── FileUpload.js
│   │   │   ├── Footer.js
│   │   │   ├── Header.js
│   │   │   ├── Icons.js
│   │   │   ├── AnimatedName.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── VisualReport.js
│   │   ├── data/              # Static data (teamData, featuresData)
│   │   ├── pages/             # Page components (Home, About, Dashboard, etc.)
│   │   ├── routes/            # Route configuration
│   │   ├── services/          # API integration layer
│   │   └── styles/            # Additional stylesheets
│   └── package.json
│
└── nlp-service/                # Python Flask Microservice
    ├── project/               # Runtime code
    │   ├── main.py            # Flask API endpoints
    │   ├── loader.py          # Model loading at startup
    │   ├── tfidf_analyzer.py  # Layer 1 — TF-IDF
    │   ├── semantic_analyzer.py # Layer 2 — FAISS Semantic Search
    │   ├── bert_classifier.py # Layer 3 — Fine-tuned BERT
    │   ├── fast_analyzer.py   # Fast mode analysis
    │   ├── guidance_engine.py # Gemini AI guidance
    │   └── cache_manager.py   # Result caching
    ├── scripts/               # One-time setup scripts
    │   ├── pan25_extractor.py # Step 1: Extract PAN25 pairs
    │   ├── preprocess_sources_pan25.py # Step 2: Build FAISS index
    │   ├── train_bert.py      # Step 3: Fine-tune BERT
    │   └── evaluate.py        # Step 4: Evaluate all layers
    ├── source_texts/          # Reference corpus (gitignored)
    ├── bert_model/            # Fine-tuned BERT model (gitignored)
    ├── cache/                 # Analysis result cache
    ├── .env                   # NLP config (Gemini API Key)
    ├── requirements.txt
    └── run.py                 # Entry point
```

---

## ⚙️ Setup and Installation

You'll need **three separate terminals** open — one for each service.

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
    *   Download the PAN25 dataset and set the path:
        ```bash
        cd scripts
        set PAN25_ROOT=C:\path\to\pan25-generated-plagiarism-detection
        ```
    *   Extract training pairs (document-level split):
        ```bash
        python pan25_extractor.py --limit 20000 --seed 42
        ```
    *   Build the FAISS source index:
        ```bash
        python preprocess_sources_pan25.py --limit 5000
        ```
    *   Fine-tune BERT (requires GPU — use Google Colab T4):
        ```bash
        python train_bert.py --epochs 3 --batch 32
        ```

6.  **Start the Service:**
    ```bash
    cd ..
    python run.py
    ```
    *Runs at http://localhost:5001*

---

## 📊 Detection Results

BERT Layer 3 — Evaluated on balanced PAN25 test set (2,000 samples):

| Metric | Value |
|---|---|
| Precision | 0.9970 |
| Recall | 0.9900 |
| F1-Score | 0.9935 |
| Accuracy | 99.35% |
| TP / FP / TN / FN | 990 / 3 / 997 / 10 |

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

## 🔮 Future Add-ons

We plan to extend Authintic with the following features:

- **PDF Integration** — Direct upload and parsing of PDF documents for plagiarism analysis, eliminating the need for manual text extraction.
- **Multi-Language Support** — Extend detection capabilities to support documents in Hindi, Marathi, and other Indian languages.
- **Batch Analysis** — Upload and analyze multiple documents simultaneously with a consolidated comparison report.
- **URL/Web Source Checking** — Cross-reference submitted text against live web pages and online academic repositories.
- **Citation Assist** — Auto-suggest proper citations (APA, MLA, IEEE) for flagged content based on detected source material.
- **History Dashboard** — Track plagiarism scores over time with per-user analytics to monitor improvement.
- **LMS Integration** — Plugins for Google Classroom, Moodle, and Canvas for seamless integration into existing academic workflows.
- **Enhanced AI Detection** — Fine-tuned models to detect content generated by ChatGPT, Gemini, Claude, and other LLMs with higher accuracy.
- **Mobile App** — Cross-platform mobile application (React Native) for on-the-go plagiarism checking.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 🪪 License

MIT License — Free for personal and educational use.

---

### 💡 Developed by [Prathmesh Mohite](https://www.linkedin.com/in/prathameshmohite1856/), [Viraj Kamble](https://www.linkedin.com/in/virajkamble0706/), [Harsh Pardeshi](https://www.linkedin.com/in/harsh-pardeshi-4ab64127b/) and [Jay Indrapal Patil](https://github.com/thisisjaypatil8)
