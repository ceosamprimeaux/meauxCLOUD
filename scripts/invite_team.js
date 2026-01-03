const team = [
    { name: 'Sam', email: 'meauxbility@gmail.com', newEmail: 'sam@meauxcloud.org' },
    { name: 'Connor', email: 'connordmcneely@gmail.com', newEmail: 'connor@meauxcloud.org' },
    { name: 'Fred', email: 'williamsfred336@gmail.com', newEmail: 'fred@meauxcloud.org' }
];

const WORKER_URL = 'https://meauxcloud.meauxbility.workers.dev/api/email/send';

async function sendInvites() {
    console.log('Sending invites...');

    for (const member of team) {
        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: member.email,
                    subject: `Welcome to MeauxCloud: ${member.newEmail}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h1 style="color: #f27a4f;">Welcome to MeauxCloud, ${member.name}!</h1>
                            <p>We are setting up your new corporate identity.</p>
                            <div style="background: #fef5f1; padding: 15px; border-radius: 8px; border-left: 4px solid #f27a4f; margin: 20px 0;">
                                <strong>Your new ID:</strong> ${member.newEmail}
                            </div>
                            <p>Access your dashboard here: <a href="https://meauxcloud.org/dashboard" style="color: #f27a4f;">MeauxCloud Dashboard</a></p>
                        </div>
                    `
                })
            });

            const data = await response.json();
            console.log(`Sent to ${member.name}:`, data);
        } catch (error) {
            console.error(`Failed to send to ${member.name}:`, error);
        }
    }
}

sendInvites();
