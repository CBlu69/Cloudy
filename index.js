// ===============================
// بات تلگرام با دکمه‌ی inline keyboard
// آماده برای دیپلوی روی Railway
// ===============================

const TelegramBot = require("node-telegram-bot-api");

// توکن از Environment Variable خونده میشه (تو Railway ست می‌کنیم)
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("خطا: BOT_TOKEN تنظیم نشده. تو Railway از بخش Variables اضافه‌اش کن.");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/cloud/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "cloud", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "☁️",
            callback_data: "cloud_clicked",
          },
        ],
      ],
    },
  });
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "cloud_clicked") {
    bot.answerCallbackQuery(query.id, { text: "☁️" });
    bot.sendMessage(chatId, "ابرت جواب داد ☁️");
  }
});

console.log("بات روشن شد و منتظر پیام است...");
