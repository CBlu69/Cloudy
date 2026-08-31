'use strict';

const { Bot } = require('node-telegram-bot-api');
const { run } = require('node-telegram-bot-api/node');

// ========================================
// CONFIG
// ========================================

const TOKEN =
    process.env.BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
    console.error('❌ BOT_TOKEN در Environment Variables تنظیم نشده.');
    process.exit(1);
}

// ========================================
// BOT
// ========================================

const bot = new Bot(TOKEN);

// ========================================
// START COMMAND
// ========================================

bot.command('start', async (ctx) => {
    try {
        const firstName =
            ctx.from?.first_name ||
            'دوست من';

        await ctx.reply(
`سلام ${firstName} 👋

🤖 ربات با موفقیت فعال شد.

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
        console.error('❌ /start error:', error);
    }
});

// ========================================
// HELP COMMAND
// ========================================

bot.command('help', async (ctx) => {
    try {
        await ctx.reply(
`📖 راهنمای ربات

دستورهای قابل استفاده:

/start
شروع ربات

/help
نمایش راهنما`
        );
    } catch (error) {
        console.error('❌ /help error:', error);
    }
});

// ========================================
// CALLBACK BUTTONS
// ========================================

bot.on('callback_query', async (ctx) => {
    try {
        const data = ctx.callbackQuery?.data;

        if (data === 'help') {
            await ctx.answerCallbackQuery();

            await ctx.reply(
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

// ========================================
// NORMAL MESSAGES
// ========================================

bot.on('message', async (ctx) => {
    try {
        const text = ctx.message?.text;

        // Commandها توسط bot.command مدیریت می‌شوند.
        if (!text || text.startsWith('/')) {
            return;
        }

        // فعلاً پاسخی برای پیام‌های معمولی نمی‌دهیم.
        // منطق اصلی ربات را می‌توانی اینجا اضافه کنی.

    } catch (error) {
        console.error('❌ Message error:', error);
    }
});

// ========================================
// ERROR HANDLING
// ========================================

bot.catch((error) => {
    console.error('❌ Telegram Bot Error:');
    console.error(error);
});

// ========================================
// START BOT
// ========================================

(async () => {
    try {
        console.log('================================');
        console.log('🚀 Starting Telegram Bot...');
        console.log('Node.js:', process.version);
        console.log('================================');

        const me = await bot.api.getMe();

        console.log('================================');
        console.log('🤖 Telegram Bot Started');
        console.log(`Username: @${me.username}`);
        console.log(`Name: ${me.first_name}`);
        console.log('Node.js:', process.version);
        console.log('================================');

        // شروع polling
        await run(bot);

    } catch (error) {
        console.error('================================');
        console.error('❌ Could not start Telegram Bot');
        console.error(error?.message || error);
        console.error('================================');

        process.exit(1);
    }
})();

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received.`);

    try {
        await bot.stop();
        console.log('✅ Bot stopped successfully.');
    } catch (error) {
        console.error(
            '❌ Error while stopping bot:',
            error?.message || error
        );
    }

    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// ========================================
// UNHANDLED ERRORS
// ========================================

process.on('unhandledRejection', (reason) => {
    console.error('❌ Unhandled Rejection:');
    console.error(reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:');
    console.error(error);
});
