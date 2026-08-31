'use strict';

const TelegramBotModule = require('node-telegram-bot-api');

// سازگار با نسخه‌های مختلف node-telegram-bot-api
const TelegramBot =
    TelegramBotModule.default ||
    TelegramBotModule.TelegramBot ||
    TelegramBotModule;

if (typeof TelegramBot !== 'function') {
    console.error('❌ خطا: node-telegram-bot-api به درستی لود نشده.');
    console.error('Loaded module:', TelegramBotModule);
    process.exit(1);
}

// ===============================
// CONFIG
// ===============================

const TOKEN = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
    console.error('❌ BOT_TOKEN در Environment Variables تنظیم نشده.');
    process.exit(1);
}

// ===============================
// BOT
// ===============================

const bot = new TelegramBot(TOKEN, {
    polling: {
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

// ===============================
// START
// ===============================

bot.on('polling_error', (error) => {
    console.error('❌ Telegram Polling Error:');
    console.error(error?.message || error);
});

bot.on('error', (error) => {
    console.error('❌ Telegram Bot Error:');
    console.error(error?.message || error);
});

bot.on('webhook_error', (error) => {
    console.error('❌ Telegram Webhook Error:');
    console.error(error?.message || error);
});

// ===============================
// /start
// ===============================

bot.onText(/^\/start$/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        await bot.sendMessage(
            chatId,
            `سلام ${msg.from?.first_name || 'دوست من'} 👋

ربات با موفقیت فعال شد.

دستورهای موجود:

/start - شروع ربات
/help - راهنما`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '📖 راهنما',
                                callback_data: 'help'
                            }
                        ]
                    ]
                }
            }
        );
    } catch (error) {
        console.error('❌ Send message error:', error);
    }
});

// ===============================
// /help
// ===============================

bot.onText(/^\/help$/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
        chatId,
        `📖 راهنمای ربات

دستورهای قابل استفاده:

/start
شروع ربات

/help
نمایش راهنما`
    );
});

// ===============================
// BUTTONS
// ===============================

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
        if (data === 'help') {
            await bot.answerCallbackQuery(query.id);

            await bot.sendMessage(
                chatId,
                `📖 راهنما

ربات شما آماده دریافت دستور است.

برای شروع:
/start`
            );
        }
    } catch (error) {
        console.error('❌ Callback error:', error);
    }
});

// ===============================
// ANY MESSAGE
// ===============================

bot.on('message', (msg) => {
    // پیام‌های command قبلاً توسط onText مدیریت می‌شوند.
    // اینجا می‌توانی منطق اصلی رباتت را اضافه کنی.
});

// ===============================
// READY
// ===============================

(async () => {
    try {
        const me = await bot.getMe();

        console.log('================================');
        console.log('🤖 Telegram Bot Started');
        console.log(`Username: @${me.username}`);
        console.log(`Name: ${me.first_name}`);
        console.log('Node.js:', process.version);
        console.log('================================');
    } catch (error) {
        console.error('❌ Could not connect to Telegram:');
        console.error(error?.message || error);

        // polling را متوقف می‌کنیم تا سرویس بی‌دلیل crash-loop نشود
        try {
            await bot.stopPolling();
        } catch (_) {}

        process.exit(1);
    }
})();

// ===============================
// GRACEFUL SHUTDOWN
// ===============================

const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Stopping bot...`);

    try {
        await bot.stopPolling();
    } catch (error) {
        console.error('Stop polling error:', error?.message || error);
    }

    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ===============================
// UNHANDLED ERRORS
// ===============================

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});
