const { Resend } = require('resend');

const resend = new Resend('re_4VDaG8eK_4K4qzzSBG5J3u5vmDRv2XsTA');

async function sendEmail(to, firstName) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Vibelabs <hello@vibelabs.no>',
      to: to,
      subject: 'See you at 15:30 - Vibecoding 101 at Atelie (Oslo Innovation Week)',
      text: `Hi ${firstName},

You're confirmed for Vibecoding 101 today!

📍 Atelie, Vika vis a vis Ruseløkkveien 26
⏰ 15:30 - 17:00

AI-powered dev tools let anyone build full-stack apps in minutes. But are we accelerating innovation - or bypassing the fundamentals of quality and security?

We'll explore this through:
• Fireside chat with Martin Jensen (TRY) and Christian von Hanno (Atelie/Vibelabs)
• Live demo: Simon transforms an audience idea into a working prototype

We're looking forward to welcoming you and hearing your take on where this is all heading.

Refreshments will be served.

Best,
Team Vibelabs`
    });

    if (error) {
      console.error(`✗ Failed to send to ${to}:`, error);
      return { success: false, error };
    }

    console.log(`✓ Sent to ${to} (${firstName}) - ID: ${data.id}`);
    return { success: true, data };
  } catch (err) {
    console.error(`✗ Error sending to ${to}:`, err.message);
    return { success: false, error: err };
  }
}

async function testTwo() {
  console.log('Sending test emails to Simon and Christian...\n');

  await sendEmail('simonstrumse@gmail.com', 'Simon');
  await new Promise(resolve => setTimeout(resolve, 200));

  await sendEmail('cvhanno@gmail.com', 'Christian');

  console.log('\nTest emails sent!');
}

testTwo();
