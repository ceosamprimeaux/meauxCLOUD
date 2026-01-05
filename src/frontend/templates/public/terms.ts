import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getTermsPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terms of Service - MeauxCLOUD</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
    <style>
        body { font-family: 'Outfit', sans-serif; background-color: #0f172a; color: white; }
        .clay-card {
            background: #1e293b;
            border-radius: 24px;
            box-shadow: 
                8px 8px 16px rgba(0, 0, 0, 0.4), 
                -8px -8px 16px rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        h2 { color: #f27a4f; margin-top: 2rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700; }
        p { color: #94a3b8; line-height: 1.7; margin-bottom: 1rem; }
        ul { list-style: disc; padding-left: 1.5rem; color: #94a3b8; margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; }
    </style>
</head>
<body class="min-h-screen flex flex-col">
    ${getPublicNav('dark')}

    <main class="flex-grow pt-32 pb-20 px-6">
        <div class="max-w-4xl mx-auto clay-card p-10 md:p-16">
            <h1 class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Terms of Service</h1>
            <p class="text-sm text-gray-500 mb-10">Last Updated: January 4, 2026</p>

            <section>
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using MeauxCLOUD ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.</p>

                <h2>2. Description of Service</h2>
                <p>MeauxCLOUD provides a cloud API integration platform that integrates Cloudflare Workers, AI, R2, and D1 databases into GitHub workflows. The details of the Service features are available on the MeauxCLOUD website.</p>

                <h2>3. User Responsibilities</h2>
                <p>You are responsible for maintaining the security of your account credentials, including your GitHub OAuth tokens and Cloudflare API keys. You are fully responsible for all activities that occur under your account.</p>

                <h2>4. Acceptable Use</h2>
                <p>You agree not to use the Service to:</p>
                <ul>
                    <li>Violate any local, state, national, or international law.</li>
                    <li>Upload or transmit viruses or any other type of malicious code.</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                </ul>

                <h2>5. Termination</h2>
                <p>We declare the right to terminate access to our Service without notice if we believe the user has violated these Terms. Upon termination, your right to use the Service will immediately cease.</p>

                <h2>6. Limitation of Liability</h2>
                <p>In no event shall MeauxCLOUD be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <h2>7. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>

                <h2>8. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@meauxcloud.org" class="text-orange-500 hover:underline">support@meauxcloud.org</a>.</p>
            </section>
        </div>
    </main>

    ${getPublicFooter('dark')}
</body>
</html>`;
}
