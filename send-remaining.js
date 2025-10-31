const { Resend } = require('resend');

const resend = new Resend('re_4VDaG8eK_4K4qzzSBG5J3u5vmDRv2XsTA');

// List of failed email addresses from the first run
const failedEmails = [
  { email: 'viral@databutton.io', firstName: 'Viral' },
  { email: 'vebbern111@gmail.com', firstName: 'Vebjørn' },
  { email: 'kenneth@whatsthefrequency.no', firstName: 'Kenneth' },
  { email: 'jerry@vuelabs.co', firstName: 'Jerry' },
  { email: 'ph@approved.no', firstName: 'Pål' },
  { email: 'hanscomtet@gmail.com', firstName: 'Hans' },
  { email: 'remikarlsen@gmail.com', firstName: 'Jens' },
  { email: 'eimantas.matulaitis@esto.eu', firstName: 'Eimantas' },
  { email: 'iamspaceal@gmail.com', firstName: 'Øivin' },
  { email: 'mgrinshpon@gmail.com', firstName: 'Mgrinshpon' },
  { email: 'jakoberikstad@gmail.com', firstName: 'Jakob' },
  { email: 'morten@gigger.no', firstName: 'Morten' },
  { email: 'mats@meshcommunity.com', firstName: 'Mats' },
  { email: 'esperocomoalas@gmail.com', firstName: 'YEFAYE' },
  { email: 'anentan.k@gmail.com', firstName: 'Anentan' },
  { email: 'danielfaeco@gmail.com', firstName: 'Daniel' },
  { email: 'asteaste@gmail.com', firstName: 'Åste' },
  { email: 'nme@stepone.no', firstName: 'Nils' },
  { email: 'alina.bezchotnikova@gmail.com', firstName: 'Alina' },
  { email: 'edithweberg27@gmail.com', firstName: 'Edithweberg27' },
  { email: 'janna.opheim@gmail.com', firstName: 'Janna' },
  { email: 'josef1.urheim@gmail.com', firstName: 'Josef' },
  { email: 'haakonjacobsen1350@gmail.com', firstName: 'Haakon' },
  { email: 'renate.pedersen03@gmail.com', firstName: 'Renate' },
  { email: 'toubha.ah@hotmail.com', firstName: 'Toubha.ah' },
  { email: 'santorgersen@gmail.com', firstName: 'Sander' },
  { email: 'rahal.belboe@gmail.com', firstName: 'Rahal' },
  { email: 'teeidem@gmail.com', firstName: 'TE' },
  { email: 'pjha224@gmail.com', firstName: 'Preeti' },
  { email: 'sergiudsarbu@gmail.com', firstName: 'sergiu' },
  { email: 'shek.henry@gmail.com', firstName: 'Henry' },
  { email: 'hammadmaleeha991@gmail.com', firstName: 'Maleeha' },
  { email: 'yawirb12@gmail.com', firstName: 'Yawirb12' },
  { email: 'allanstrand@gmail.com', firstName: 'allan' },
  { email: 'harrison.friedes@hrf.org', firstName: 'Harrison' },
  { email: 'miles@tu.no', firstName: 'Miles' }
];

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

    console.log(`✓ Sent to ${to} (${firstName})`);
    return { success: true, data };
  } catch (err) {
    console.error(`✗ Error sending to ${to}:`, err.message);
    return { success: false, error: err };
  }
}

async function sendRemaining() {
  console.log(`Retrying ${failedEmails.length} failed emails with proper rate limiting...\n`);

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < failedEmails.length; i++) {
    const { email, firstName } = failedEmails[i];
    console.log(`[${i + 1}/${failedEmails.length}] Sending to ${email}...`);

    const result = await sendEmail(email, firstName);

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // 500ms delay = 2 requests per second (Resend rate limit)
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== RETRY SUMMARY ===');
  console.log(`Total retried: ${failedEmails.length}`);
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
  console.log(`\n=== OVERALL TOTAL ===`);
  console.log(`Total sent: ${64 + sent}/100`);
}

sendRemaining().catch(console.error);
