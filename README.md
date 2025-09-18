# AI Essay Corrector

This is an AI-powered web application designed to help users improve their writing skills. By leveraging the Google Gemini API, it provides detailed analysis, corrections, and constructive feedback on essays.

The application features a clean, responsive, and user-friendly interface with a side-by-side view for easy comparison of the original text and the corrected version. It also includes an interactive AI chat assistant to answer any follow-up questions about the feedback.



## ✨ Key Features

- **Advanced AI Analysis**: Get comprehensive feedback on grammar, spelling, clarity, style, punctuation, and structure.
- **Detailed Scoring**: Receive a score breakdown for each writing category, including an overall score, to quickly gauge strengths and weaknesses.
- **Side-by-Side View**: The original essay, AI feedback, corrected version, and AI chat are organized in a clear, multi-panel layout.
- **Interactive Corrections**: Hover over highlighted suggestions in the corrected text to see the original phrase and the AI's explanation.
- **AI Assistant Chat**: Ask follow-up questions about your essay or the feedback provided and get instant answers from an AI tutor.
- **Multiple Upload Options**: Paste text directly, or upload files including `.txt`, `.md`, and images (`.png`, `.jpg`) with automatic text extraction (OCR).
- **Responsive Design**: A modern and fully responsive UI that works seamlessly on desktops, tablets, and mobile devices.
- **Dark Mode**: Includes a sleek dark mode for comfortable viewing in low-light environments.

## 🚀 How to Use

1.  **Enter Your Essay**:
    -   Type or paste your essay into the "Your Essay" text area on the left.
    -   Alternatively, click the **Upload** button to select a `.txt`, `.md`, or image file from your device. The text will be automatically loaded into the editor.
2.  **Get Feedback**:
    -   Click the **Correct Essay** button.
    -   The AI will analyze your text, and the "Feedback & score card" panel on the right will display the results.
3.  **Review Corrections**:
    -   An "AI Summary" provides a high-level overview of the feedback.
    -   The "Score Breakdown" gives you a detailed look at your performance in each category.
    -   The "Corrected Essay" view appears below, showing your essay with highlighted improvements. Hover over any highlight to see the specific change and the reason for it.
4.  **Ask Questions**:
    -   Use the "AI Assistant" chat panel to ask any questions about the corrections, seek clarification, or request further writing advice.

## 🛠️ Technology Stack

-   **Frontend**: Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for a robust and type-safe user interface.
-   **Styling**: Styled with [Tailwind CSS](https://tailwindcss.com/) for a modern, utility-first design system.
-   **AI Engine**: Powered by the **Google Gemini API** (`gemini-2.5-flash`) for all core functionalities, including:
    -   Essay correction and feedback generation.
    -   Text extraction from images (OCR).
    -   Conversational AI for the chat assistant.

## 📁 Project Structure

```
.
├── index.html                # Main HTML entry point
├── index.tsx                 # Main React application entry point
├── App.tsx                   # Root component, manages state and layout
├── metadata.json             # Application metadata
├── README.md                 # This file
├── services/
│   └── geminiService.ts      # Logic for all Gemini API interactions
├── components/
│   ├── EssayInput.tsx        # Component for text input and file uploads
│   ├── CorrectionOutput.tsx  # Component to display summary and scores
│   ├── CorrectedEssayView.tsx# Component to display the essay with highlights
│   ├── ScoreCard.tsx         # Component for the score breakdown visualization
│   ├── ChatPanel.tsx         # Interactive chat interface component
│   ├── LoadingSpinner.tsx    # Reusable loading spinner
│   └── icons.tsx             # SVG icon components
└── types.ts                  # TypeScript type definitions for the application
```
