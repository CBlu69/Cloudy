'use strict';

const TelegramBot = require('node-telegram-bot-api');

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
    polling: true
});

// ===============================
// ERROR HANDLING
// ===============================

bot.on('polling_error', (error) => {
    console.error('❌ Telegram Polling Error:', error.message);
});

bot.on('error', (error) => {
    console.error('❌ Telegram Bot Error:', error.message);
});

// ===============================
// /start
// ===============================

bot.onText(/^\/start$/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        await bot.sendMessage(
            chatId,
            `سلام ${msg.from.first_name || 'دوست من'} 👋\n\nربات با موفقیت فعال شد.\n\nدستورهای موجود:\n\n/start - شروع ربات\n/help - راهنما`,
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
        console.error('❌ Send message error:', error.message);
    }
});

// ===============================
// /help
// ===============================

bot.onText(/^\/help$/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        await bot.sendMessage(
            chatId,
            `📖 راهنمای ربات\n\nدستورهای قابل استفاده:\n\n/start - شروع ربات\n/help - نمایش راهنما`
        );
    } catch (error) {
        console.error('❌ Send message error:', error.message);
    }
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
                `📖 راهنما\n\nربات شما آماده دریافت دستور است.\n\nبرای شروع:\n/start`
            );
        }
    } catch (error) {
        console.error('❌ Callback error:', error.message);
    }
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
        console.error('❌ Could not connect to Telegram:', error.message);
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
        console.error('Stop polling error:', error.message);
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
    console.error('❌ Uncaught Exception:', error.message);
});
