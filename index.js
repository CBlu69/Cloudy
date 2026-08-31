const { Bot } = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN environment variable is missing.");
  process.exit(1);
}

const bot = new Bot(TOKEN);

console.log("🚀 Starting Telegram Bot v2.1.0...");

// /start
bot.command("start", async (ctx) => {
  await ctx.reply(
    "سلام 👋\n\nربات با موفقیت فعال شد.\nنسخه: 2.1.0"
  );
});

// /help
bot.command("help", async (ctx) => {
  await ctx.reply(
    "راهنمای ربات:\n\n" +
    "/start - شروع ربات\n" +
    "/help - راهنما"
  );
});

// Echo
bot.hears(/(.+)/, async (ctx) => {
  const text = ctx.match?.[1];

  if (!text) return;

  // دستورات را دوباره Echo نکن
  if (text.startsWith("/")) return;

  await ctx.reply(`شما گفتید:\n${text}`);
});

// Error handling
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

// Start polling
async function start() {
  try {
    console.log("📡 Starting polling...");

    await bot.startPolling();

    console.log("✅ Telegram Bot v2.1.0 is running.");
  } catch (error) {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  }
}

start();
