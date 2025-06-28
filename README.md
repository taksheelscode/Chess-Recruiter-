✅ What We'll Do
We'll create everything on your Desktop, including:
	•	App.js code (chess + scoring + timer)
	•	resume.pdf (opens when score ≥ 400)
	•	Everything in one place via a proper React setup

🧰 What You Need Installed
Make sure:
	•	Node.js is installed (https://nodejs.org)
	•	A code editor (like VS Code)

✅ STEP-BY-STEP INSTRUCTIONS

📁 1. Open Terminal and Create App on Desktop
bash
CopyEdit
cd ~/Desktop
npx create-react-app chess-recruiter
cd chess-recruiter
✅ This creates chess-recruiter on your Desktop with:
java
CopyEdit
/Desktop/chess-recruiter/
├── public/
├── src/
├── package.json

📥 2. Install Chess Libraries
bash
CopyEdit
npm install react-chessboard chess.js

📄 3. Add Your Resume
	•	Go to /Desktop/chess-recruiter/public/
	•	Copy and paste your resume file
	•	Rename it to: resume.pdf
✅ Your file path should now be:
swift
CopyEdit
/Desktop/chess-recruiter/public/resume.pdf

✍️ 4. Replace App Code
	1	Open Desktop/chess-recruiter/src/App.js in VS Code
	2	Delete everything inside
	3	Paste this complete working code:
	4	add the 3 Stockfish files to public folder inside a Stockfish Folder
🚀 5. Run Your App
Back in terminal:
bash
CopyEdit
npm start
This will:
	•	Open http://localhost:3000
	•	Show the chessboard
