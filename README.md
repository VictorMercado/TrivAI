🎉 TrivAI – The Ultimate Quiz Experience! 🎉

TrivAI is a web-based platform designed for creating, assigning, and playing multiplayer quizzes with friends. Whether it’s testing academic knowledge, pop culture trivia, or just some fun random facts, TrivAI makes learning and competition exciting!

🚀 Create. Assign. Play. Compete. 🚀

🌟 Features

✅ Custom Quiz Creation – Design quizzes on any topic with multiple question types.
✅ Multiplayer Mode – Collaborate with your friends in real-time quiz sessions.
✅ Group Assignments – Share quizzes with friends or study groups.
✅ Interactive Gameplay – A smooth and engaging user experience.
✅ Leaderboard & Stats – Track scores and see who reigns supreme.
✅ Customization – Personalize quizzes with themes and unique settings.

🎮 How It Works

1️⃣ Sign Up/Login – Create an account to get started.
2️⃣ Create a Quiz – Add questions, set timers, and customize difficulty.
3️⃣ Assign & Invite – Share quizzes with friends or a group.
4️⃣ Play & Compete – Join multiplayer sessions or take quizzes at your own pace.
5️⃣ Track Progress – View stats and leaderboards to see who’s on top!

💡 Why TrivAI?
	•	Encourages social learning through collaboration and competition.
	•	Provides a seamless quiz-making and playing experience.
	•	Perfect for classrooms, game nights, and friendly challenges!

🛠️ Tech Stack
	•	Frontend: React.js / Next.js
	•	Backend: Bun.js / Elysia.js
	•	Database: MySQL
	•	Authentication: OAuth / JWT / Auth.js
	•	Hosting: Railway(DB) and Vercel(Web/API)

Installation & Setup

1.  **Clone the Repository:**

    ```bash
    git clone [your_repository_url]
    cd TrivAI
    ```

2.  **Install Dependencies:**

    ```bash
    # Example using npm (Node Package Manager) - adjust as needed
    npm install
    ```

3.  **Configure the Application:**

    *   Set up your database connection (if applicable) in the `.env` file. (Example `.env` file below)
    *   Configure API keys (if needed)

    ```
    # .env example
    DATABASE_URL=your_database_url
    API_KEY=your_api_key
    ```
    *   Start the database with bash or turbo

    ```bash
    # Example using docker compose
    docker-compose up -d
    <!-- or -->
    turbo db-up
    ```


4.  **Run the Application:**

    ```bash
    # Example using turbo
    turbo dev
    ```

5.  **Access the platform in your browser:** `http://localhost:3000` (or the appropriate port)


🚧 Roadmap

🔹 AI-powered quiz suggestions & auto-generated questions.
🔹 Multiplayer race mode.
🔹 Enhanced real-time features with WebSockets.
🔹 Mobile app version for on-the-go quizzing.

📬 Get Involved

We’d love your feedback and contributions! Feel free to open issues or submit PRs.

📧 Contact: [your.email@example.com]
🌍 Website: TrivAI.com