module.exports = {
  apps: [
    {
      name: "Twitter_Telegram_bot_updateFu",
      script: "./server.js",
      watch: true,
      max_memory_restart: "900M",
    },
  ],
};
