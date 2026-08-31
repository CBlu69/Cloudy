// ===============================
// Telegram Bot
// Inline Keyboard
// Ready for Railway
// ===============================

const TelegramBot = require("node-telegram-bot-api");

// دریافت توکن از Railway Variables
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ خطا: BOT_TOKEN تنظیم نشده است.");
  console.error("در Railway از بخش Variables مقدار BOT_TOKEN را اضافه کن.");
  process.exit(1);
}

// ساخت بات
const bot = new TelegramBot(TOKEN, {
  polling: true
});

// ===============================
// Cloud Button
// ===============================

const cloudButton = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "☁️",
          url: "https://t.me/N0t_Cloudy"
        }
      ]
    ]
  }
};

// ===============================
// /cloud command
// ===============================

bot.onText(/^\/cloud$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(
      chatId,
      "cloud",
      cloudButton
    );
  } catch (error) {
    console.error("❌ خطا در ارسال پیام:", error.message);
  }
});

// ===============================
// Files with /cloud caption
// ===============================

bot.on("message", async (msg) => {
  const caption = msg.caption || "";

  // اگر کپشن با /cloud شروع نشده، کاری نکن
  if (!caption.startsWith("/cloud")) {
    return;
  }

  const chatId = msg.chat.id;

  try {

    // 🎵 Audio
    if (msg.audio) {
      await bot.sendAudio(
        chatId,
        msg.audio.file_id,
        {
          caption: msg.audio.title || "cloud",
          ...cloudButton
        }
      );
    }

    // 🎙 Voice
    else if (msg.voice) {
      await bot.sendVoice(
        chatId,
        msg.voice.file_id,
        cloudButton
      );
    }

    // 📄 Document
    else if (msg.document) {
      await bot.sendDocument(
        chatId,
        msg.document.file_id,
        cloudButton
      );
    }

  } catch (error) {
    console.error(
      "❌ خطا در ارسال فایل:",
      error.message
    );
  }
});

// ===============================
// Polling errors
// ===============================

bot.on("polling_error", (error) => {
  console.error(
    "❌ Telegram Polling Error:",
    error.message
  );
});

// ===============================
// Ready
// ===============================

console.log("=================================");
console.log("🤖 Telegram Bot Started");
console.log("☁️ Cloud command is ready");
console.log("=================================");
