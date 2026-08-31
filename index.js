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

const cloudButton = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "☁️",
          url: "https://t.me/N0t_Cloudy",
        },
      ],
    ],
  },
};

// وقتی پیام متنی /cloud تنها فرستاده بشه (بدون فایل)
bot.onText(/^\/cloud$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "cloud", cloudButton);
});

// وقتی آهنگ/فایل صوتی با کپشن /cloud فرستاده بشه
bot.on("message", (msg) => {
  const caption = msg.caption || "";
  if (!caption.startsWith("/cloud")) return;

  const chatId = msg.chat.id;

  if (msg.audio) {
    bot.sendAudio(chatId, msg.audio.file_id, {
      caption: msg.audio.title || "cloud",
      ...cloudButton,
    });
  } else if (msg.voice) {
    bot.sendVoice(chatId, msg.voice.file_id, cloudButton);
  } else if (msg.document) {
    bot.sendDocument(chatId, msg.document.file_id, cloudButton);
  }
});

console.log("بات روشن شد و منتظر پیام است...");
