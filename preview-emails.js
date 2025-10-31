const fs = require('fs');

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

function previewEmail(email, firstName, index) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`EMAIL #${index}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`To: ${email}`);
  console.log(`From: Vibelabs <hello@vibelabs.no>`);
  console.log(`Subject: See you at 15:30 - Vibecoding 101 at Atelie (Oslo Innovation Week)`);
  console.log(`\n${'-'.repeat(70)}\n`);
  console.log(`Hi ${firstName},

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
Team Vibelabs`);
  console.log(`\n${'-'.repeat(70)}`);
}

const csvFile = 'oslo-innovation-week-vibecoding-101-speed-vs-substance-security-20251023-attendees (6).csv';
const csvContent = fs.readFileSync(csvFile, 'utf-8');
const attendees = parseCSV(csvContent);

console.log(`Total attendees found: ${attendees.length}\n`);
console.log('Previewing first 3 emails:\n');

// Preview first 3
for (let i = 0; i < Math.min(3, attendees.length); i++) {
  previewEmail(attendees[i].email, attendees[i].firstName, i + 1);
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Ready to send to ${attendees.length} attendees`);
console.log(`${'='.repeat(70)}\n`);
