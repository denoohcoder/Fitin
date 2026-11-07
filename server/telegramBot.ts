import TelegramBot from 'node-telegram-bot-api';
import { randomUUID } from 'node:crypto';

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
const adminUserId = process.env.TELEGRAM_ADMIN_USER_ID;

if (!token || !adminChatId || !adminUserId) {
  throw new Error(
    'Set TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, and TELEGRAM_ADMIN_USER_ID.'
  );
}

const bot = new TelegramBot(token, { polling: true });

// Demo-only in-memory storage; data is lost when the process restarts.
const flows = new Map();
const applications = new Map();

const menuKeyboard = {
  inline_keyboard: [
    [{ text: 'Start a loan request', callback_data: 'loan:start' }],
  ],
};

function amountKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '$500', callback_data: 'amount:500' },
        { text: '$1,000', callback_data: 'amount:1000' },
      ],
      [
        { text: '$2,500', callback_data: 'amount:2500' },
        { text: '$5,000', callback_data: 'amount:5000' },
      ],
      [{ text: 'Cancel', callback_data: 'loan:cancel' }],
    ],
  };
}

function termKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '6 months', callback_data: 'term:6' },
        { text: '12 months', callback_data: 'term:12' },
      ],
      [
        { text: '24 months', callback_data: 'term:24' },
        { text: '36 months', callback_data: 'term:36' },
      ],
      [{ text: 'Cancel', callback_data: 'loan:cancel' }],
    ],
  };
}

function purposeKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: 'Emergency', callback_data: 'purpose:emergency' },
        { text: 'Education', callback_data: 'purpose:education' },
      ],
      [
        { text: 'Business', callback_data: 'purpose:business' },
        { text: 'Other', callback_data: 'purpose:other' },
      ],
      [{ text: 'Cancel', callback_data: 'loan:cancel' }],
    ],
  };
}

function reviewKeyboard() {
  return {
    inline_keyboard: [
      [{ text: 'Submit request for review', callback_data: 'loan:confirm' }],
      [{ text: 'Cancel', callback_data: 'loan:cancel' }],
    ],
  };
}

function adminDecisionKeyboard(applicationId) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Accept', callback_data: `app:accept:${applicationId}` },
        { text: '❌ Reject', callback_data: `app:reject:${applicationId}` },
      ],
    ],
  };
}

bot.onText(/\/start/, async (msg) => {
  flows.delete(msg.chat.id);

  await bot.sendMessage(
    msg.chat.id,
    'Welcome to Fitin. Choose an option to preview a loan request.',
    { reply_markup: menuKeyboard }
  );
});

// Handy for finding the IDs to configure in the environment.
bot.onText(/\/id/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    `Chat ID: ${msg.chat.id}\nYour user ID: ${msg.from.id}`
  );
});

bot.onText(/\/cancel/, async (msg) => {
  flows.delete(msg.chat.id);
  await bot.sendMessage(msg.chat.id, 'Request canceled.', {
    reply_markup: menuKeyboard,
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat.id;
  const data = query.data;

  if (chatId === undefined || !data) {
    await bot.answerCallbackQuery(query.id);
    return;
  }

  // Admin-only decision buttons.
  const decisionMatch = data.match(/^app:(accept|reject):([a-f0-9-]+)$/i);

  if (decisionMatch) {
    if (String(query.from.id) !== String(adminUserId)) {
      await bot.answerCallbackQuery(query.id, {
        text: 'You are not authorized to decide this request.',
        show_alert: true,
      });
      return;
    }

    const [, decision, applicationId] = decisionMatch;
    const application = applications.get(applicationId);

    if (!application || application.status !== 'pending') {
      await bot.answerCallbackQuery(query.id, {
        text: 'This request is no longer pending.',
        show_alert: true,
      });
      return;
    }

    application.status = decision === 'accept' ? 'accepted' : 'rejected';

    await bot.answerCallbackQuery(query.id, {
      text: `Request ${application.status}.`,
    });

    const adminMessage = [
      `Request ${application.status.toUpperCase()}`,
      `Reference: ${application.id}`,
      `Applicant chat ID: ${application.applicantChatId}`,
      `Amount: $${application.amount.toLocaleString()}`,
      `Term: ${application.months} months`,
      `Purpose: ${application.purpose}`,
    ].join('\n');

    await bot.editMessageText(adminMessage, {
      chat_id: chatId,
      message_id: query.message.message_id,
    });

    try {
      await bot.sendMessage(
        application.applicantChatId,
        `Your request (${application.id}) was ${application.status}.`
      );
    } catch (error) {
      console.error('Could not notify applicant:', error.message);
    }

    return;
  }

  await bot.answerCallbackQuery(query.id);

  if (data === 'loan:cancel') {
    flows.delete(chatId);
    await bot.sendMessage(chatId, 'Request canceled.', {
      reply_markup: menuKeyboard,
    });
    return;
  }

  if (data === 'loan:start') {
    flows.set(chatId, { step: 'amount' });
    await bot.sendMessage(chatId, 'Choose a requested amount:', {
      reply_markup: amountKeyboard(),
    });
    return;
  }

  const flow = flows.get(chatId);

  if (!flow) {
    await bot.sendMessage(chatId, 'Start a request from the menu:', {
      reply_markup: menuKeyboard,
    });
    return;
  }

  if (data.startsWith('amount:') && flow.step === 'amount') {
    const amount = Number(data.slice('amount:'.length));
    if (![500, 1000, 2500, 5000].includes(amount)) return;

    flows.set(chatId, { ...flow, amount, step: 'term' });
    await bot.sendMessage(chatId, 'Choose a repayment term:', {
      reply_markup: termKeyboard(),
    });
    return;
  }

  if (data.startsWith('term:') && flow.step === 'term') {
    const months = Number(data.slice('term:'.length));
    if (![6, 12, 24, 36].includes(months)) return;

    flows.set(chatId, { ...flow, months, step: 'purpose' });
    await bot.sendMessage(chatId, 'Choose the loan purpose:', {
      reply_markup: purposeKeyboard(),
    });
    return;
  }

  if (data.startsWith('purpose:') && flow.step === 'purpose') {
    const purpose = data.slice('purpose:'.length);
    if (!['emergency', 'education', 'business', 'other'].includes(purpose)) return;

    const updatedFlow = { ...flow, purpose, step: 'review' };
    flows.set(chatId, updatedFlow);

    await bot.sendMessage(
      chatId,
      [
        'Review your request:',
        `Amount: $${updatedFlow.amount.toLocaleString()}`,
        `Term: ${updatedFlow.months} months`,
        `Purpose: ${updatedFlow.purpose}`,
        '',
        'No personal or financial details are collected by this demo.',
      ].join('\n'),
      { reply_markup: reviewKeyboard() }
    );
    return;
  }

  if (data === 'loan:confirm' && flow.step === 'review') {
    const applicationId = randomUUID();

    const application = {
      id: applicationId,
      applicantChatId: chatId,
      amount: flow.amount,
      months: flow.months,
      purpose: flow.purpose,
      status: 'pending',
    };

    applications.set(applicationId, application);
    flows.delete(chatId);

    await bot.sendMessage(
      adminChatId,
      [
        'New loan request — pending review',
        `Reference: ${application.id}`,
        `Applicant chat ID: ${application.applicantChatId}`,
        `Amount: $${application.amount.toLocaleString()}`,
        `Term: ${application.months} months`,
        `Purpose: ${application.purpose}`,
      ].join('\n'),
      { reply_markup: adminDecisionKeyboard(applicationId) }
    );

    await bot.sendMessage(
      chatId,
      `Your request (${applicationId}) was sent for review.`,
      { reply_markup: menuKeyboard }
    );
  }
});

bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.message);
});

console.log('Telegram bot is polling for updates.');

process.once('SIGINT', () => bot.stopPolling());
process.once('SIGTERM', () => bot.stopPolling());
