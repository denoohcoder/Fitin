# Telegram admin notifications

This project uses a Vercel serverless function at `api/application.ts`. After the demo OTP screen, the frontend posts the loan amount, term, currency, and purpose to `/api/application`; the function sends those fields to the configured Telegram chat and returns a reference. It intentionally does not send/store the applicant's name, phone, email, national ID, or income. The OTP screen is a simulation, and a submitted application is not an approval or loan offer.

## Configure deployment

1. Create a Telegram bot with BotFather and keep its token private. Never put the token in frontend code or a `VITE_` variable.
2. Start a private chat with the bot (send `/start`) or add it to the intended admin group. Telegram does not let a bot initiate a private conversation until the user starts it.
3. Get the target chat ID (for a private chat, use the bot's `/id` command if available, or obtain it from your bot's update handling).
4. In the Vercel project settings, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ADMIN_CHAT_ID` as server-side environment variables for the deployment environments you use, then redeploy.
5. Test a demo submission and check the Vercel function logs if the frontend reports a notification failure.

For local testing, run the project with Vercel's local development command (`vercel dev`) after setting those variables in a local, untracked `.env.local` file. Do not commit credentials. If a real bot token has ever been committed to the repository, revoke it with BotFather and replace it.

This endpoint is intended for a demo. Before using it for real financial applications, replace the simulated OTP and approval flow with verified services, add durable storage and abuse protection, and use an authorized secure system—not Telegram—for sensitive applicant data.
