import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getPrivacyPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - MeauxCLOUD</title>
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
            <h1 class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">Privacy Policy</h1>
            <p class="text-sm text-gray-500 mb-10">Last Updated: January 4, 2026</p>

            <section>
                <p>At MeauxCLOUD ("we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (meauxcloud.org) or use our services.</p>

                <h2>1. Data We Collect</h2>
                <p>We purposefully limit data collection to the absolute minimum required to provide our services:</p>
                <ul>
                    <li><strong>Identity Data:</strong> Name, username, or similar identifier provided via GitHub/Google OAuth.</li>
                    <li><strong>Contact Data:</strong> Email address.</li>
                    <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                    <li><strong>Usage Data:</strong> Information about how you use our deployments, R2 storage, and D1 databases.</li>
                </ul>

                <h2>2. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we use your personal data in the following circumstances:</p>
                <ul>
                    <li>To provide the Cloud API Integration Platform services you have requested.</li>
                    <li>To authenticate your identity across our multi-tenant architecture.</li>
                    <li>To manage our relationship with you (deployment notifications, billing).</li>
                </ul>

                <h2>3. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. We use <strong>Google Cloud Secret Manager</strong> for credential storage and all data is encrypted in transit via TLS 1.3.</p>

                <h2>4. Data Retention</h2>
                <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for. Active user data is retained indefinitely to maintain service continuity. Deleted users are purged from our systems within 30 days.</p>

                <h2>5. Third-Party Services</h2>
                <p>We utilize the following trusted sub-processors:</p>
                <ul>
                    <li><strong>Cloudflare:</strong> For edge infrastructure, potential data processing in US/EU.</li>
                    <li><strong>Google Cloud:</strong> For OAuth and AI services.</li>
                    <li><strong>Supabase:</strong> For relational database storage.</li>
                </ul>

                <h2>6. Your Legal Rights (GDPR)</h2>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, or transfer of your data.</p>
                <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@meauxcloud.org" class="text-orange-500 hover:underline">privacy@meauxcloud.org</a>.</p>
            </section>
        </div>
    </main>

    ${getPublicFooter('dark')}
</body>
</html>`;
}
