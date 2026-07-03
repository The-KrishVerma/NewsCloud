# NewsCloud 🌍📰

NewsCloud is a modern, AI-powered news aggregator and analysis platform built with React. It goes beyond just displaying headlines by leveraging the power of Google's Gemini AI to analyze bias, detect potential fake news, and summarize long articles, giving users a smarter way to consume daily information.

## 🚀 Key Features

### 📰 Smart News Aggregation
- **Global News Feed:** Stay up to date with real-time top headlines across 7 major categories (Business, Entertainment, General, Health, Science, Sports, Technology).
- **Advanced Filtering:** Filter the live feed by specific countries and languages.

### 🔍 News Finder
- **Advanced Global Search:** Dive deep into specific topics, events, or keywords using the dedicated News Finder engine. It crawls thousands of global sources to pull the most relevant articles for whatever you are researching.

### 📝 Link Summarizer
- **Instant AI Summaries:** Don't have time to read a massive article? Paste the URL into the summarizer and get a clean, bulleted summary of the key takeaways.

### ⚖️ Compare News
- **Cross-Source Analysis:** Search for a topic and let AI compare how different sources are covering the exact same story, highlighting overlapping facts and differing perspectives side-by-side.

### 🛡️ Article Tools (Verify, Bias Analysis & Listen)
- **AI Verify (Fake News Detection):** Instantly analyze the probability that an article is misleading or fake, accompanied by a brief AI explanation.
- **Bias Analysis:** Automatically classify the political leaning (Left, Center, Right) or sensationalism of an article to help you read critically.
- **Listen to Articles:** Built-in Text-to-Speech (TTS) integration allows you to listen to article headlines and descriptions on the go.

### 🎨 Premium UI & Accessibility
- **Glassmorphism Design:** A sleek, responsive dark-mode design with smooth micro-animations and blurred backdrops.
- **Dynamic Sidebars:** Context-aware navigation and layout that adapts based on the page you are viewing.

### 👤 User Management & Analytics
- **Firebase Authentication:** Secure email/password and social login.
- **Profile Customization:** Upload and auto-save profile avatars (powered by Firebase Cloud Storage).
- **Reading Analytics:** Track your reading habits with a personalized insights dashboard that visualizes the categories of news you read most often.

## 🚀 Modern Tech Stack
- **Frontend Core:** React.js powered by Vite (Next-generation, blazing fast frontend tooling)
- **Routing:** React Router v7 (Dynamic, client-side routing)
- **Styling & UI Framework:** Tailwind CSS & DaisyUI (Utility-first CSS for sleek, glassmorphism designs)
- **Icons & Visuals:** React Icons & React Social Icons
- **Data Visualization:** Recharts (For generating the interactive Analytics Insights Dashboard)
- **Content Parsing:** `@mozilla/readability` & `react-markdown` (For securely parsing scraped HTML and cleanly formatting Markdown from AI responses)
- **Network & Utilities:** Axios (Promise-based HTTP client), `date-fns` (Modern date utility), `react-fast-marquee`
- **Serverless Backend (BaaS):** Firebase (Authentication, Firestore Database, and Cloud Storage for avatars)
- **APIs & AI:** 
  - [NewsAPI](https://newsapi.org/) (Real-time Core News Engine)
  - [Google Gemini API](https://ai.google.dev/) (LLM for AI Summarization, Bias Detection, and Fake News Verification)
  - Proxy Services (AllOrigins, ThingProxy) for robust CORS bypassing on external URL scraping.

## ⚙️ Environment Setup

To run this project locally, you will need to create a `.env` file in the root directory with the following keys:

```env
# News Engine
VITE_NEWS_API_KEY=your_newsapi_key

# Google Gemini AI
VITE_SMRY_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## 💻 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---
*Built with ❤️ for a smarter, more informed world.*
