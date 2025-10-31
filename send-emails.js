const { Resend } = require('resend');
const fs = require('fs');

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

    console.log(`✓ Sent to ${to} (${firstName})`);
    return { success: true, data };
  } catch (err) {
    console.error(`✗ Error sending to ${to}:`, err.message);
    return { success: false, error: err };
  }
}

function extractFirstName(fullName, email) {
  // If no name provided, extract from email
  if (!fullName || fullName.trim() === '') {
    const emailName = email.split('@')[0];
    // Capitalize first letter
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  // Remove quotes if present
  const cleanName = fullName.replace(/"/g, '').trim();

  // Split on space and take first part
  const firstName = cleanName.split(' ')[0];

  return firstName;
}

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const attendees = [];

  // Skip header (line 0) and process data lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handling quoted fields)
    const fields = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    if (!fields || fields.length < 4) continue;

    const email = fields[3].replace(/"/g, '').trim();
    const name = fields[2].replace(/"/g, '').trim();

    if (email && email.includes('@')) {
      const firstName = extractFirstName(name, email);
      attendees.push({ email, name, firstName });
    }
  }

  return attendees;
}

async function sendBulkEmails(csvFilePath) {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');

  console.log('Parsing attendees...');
  const attendees = parseCSV(csvContent);

  console.log(`Found ${attendees.length} attendees with valid emails\n`);
  console.log('Starting to send emails...\n');

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < attendees.length; i++) {
    const { email, firstName } = attendees[i];
    console.log(`[${i + 1}/${attendees.length}] Sending to ${email}...`);

    const result = await sendEmail(email, firstName);

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total: ${attendees.length}`);
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
}

// Run bulk send
const csvFile = process.argv[2] || 'oslo-innovation-week-vibecoding-101-speed-vs-substance-security-20251023-attendees (6).csv';
sendBulkEmails(csvFile).catch(console.error);
