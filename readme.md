To fully understand this project, you need to familiarize yourself with the repository: https://github.com/sergienko314/Parser-Twitter_chat-gpt-comments_Telegram-bot.git
This project is implemented as an addition and a separate logic for updating all posts by subscriptions.
To run the project, you will need to specify the following data in the ENV file.

1. PORT=3000.
2. MONGO_URL= Your URL for the database.
3. OPENAI_API_KEY= Get a unique key in your OpenAI account.

To run the project, type npm run dev or npm start at the command line.
Please note that various settings for the puppeteer can be used to trigger the parsing function: usually headless=false for the computer; For server headless=true
