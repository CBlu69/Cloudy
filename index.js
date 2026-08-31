const { Bot } = require("node-telegram-bot-api");

// ==========================================
// Configuration
// ==========================================

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
console.error("❌ BOT_TOKEN is not set.");
process.exit(1);
}

// ==========================================
// Create Bot
// ==========================================

const bot = new Bot(TOKEN);

// ==========================================
// Cloud Button
// ==========================================

const cloudKeyboard = {
inline_keyboard: [
[
{
text: "☁️",
url: "https://t.me/N0t_Cloudy"
}
]
]
};

// ==========================================
// /cloud command
// ==========================================

bot.command("cloud", async (ctx) => {
try {
await ctx.reply("cloud", {
reply_markup: cloudKeyboard
});
} catch (error) {
console.error("❌ Error sending /cloud:", error);
}
});

// ==========================================
// Audio / Voice / Document
// with /cloud caption
// ==========================================

bot.on("message", async (ctx) => {
const message = ctx.message;

if (!message) return;

const caption = message.caption || "";

if (!caption.startsWith("/cloud")) {
return;
}

try {
// ======================================
// 🎵 Audio
// ======================================

if (message.audio) {
  await ctx.api.sendAudio({
    chat_id: message.chat.id,
    audio: message.audio.file_id,
    caption: message.audio.title || "cloud",
    reply_markup: cloudKeyboard
  });

  return;
}

// ======================================
// 🎙 Voice
// ======================================

if (message.voice) {
  await ctx.api.sendVoice({
    chat_id: message.chat.id,
    voice: message.voice.file_id,
    reply_markup: cloudKeyboard
  });

  return;
}

// ======================================
// 📁 Document
// ======================================

if (message.document) {
  await ctx.api.sendDocument({
    chat_id: message.chat.id,
    document: message.document.file_id,
    reply_markup: cloudKeyboard
  });

  return;
}

} catch (error) {
console.error("❌ Error sending media:", error);
}
});

// ==========================================
// Error Handler
// ==========================================

bot.catch((error, ctx) => {
console.error("❌ Bot error:", error);
});

// ==========================================
// Start Polling
// ==========================================

async function start() {
try {
console.log("🚀 Starting Telegram bot...");

await bot.startPolling();

console.log("✅ Bot is running.");
console.log("☁️ Cloud bot is ready.");

} catch (error) {
console.error("❌ Failed to start bot:", error);
process.exit(1);
}
}

start();

// ==========================================
// Graceful Shutdown
// ==========================================

process.once("SIGINT", async () => {
console.log("🛑 SIGINT received. Stopping bot...");

try {
await bot.stopPolling();
} catch (error) {
console.error(error);
}

process.exit(0);
});

process.once("SIGTERM", async () => {
console.log("🛑 SIGTERM received. Stopping bot...");

try {
await bot.stopPolling();
} catch (error) {
console.error(error);
}

process.exit(0);
});
