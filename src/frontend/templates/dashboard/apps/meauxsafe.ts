import { getLayout, html } from '../../layout';
import type { UserSession } from '../../../../middleware/session';

export function getMeauxSafePage(env: any, user: UserSession) {
    const content = html`
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Meaux<span class="text-blue-500">SAFE</span></h1>
                <p class="text-gray-500 mt-1">AI Brand Police & Compliance Audit</p>
            </div>
            <div>
                <span class="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    Brand Guardian Active
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Input Panel -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-blue-100/50 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-bold text-gray-900">Content Audit</h3>
                        <span class="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">Brand Bible v2.4</span>
                    </div>
                    
                    <textarea 
                        id="auditContent" 
                        rows="12" 
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all font-mono text-sm" 
                        placeholder="Paste your content here for analysis:

• Ad copy
• Email drafts  
• Social media posts
• Hex color codes
• Marketing materials

The AI will verify alignment with your brand guidelines..."
                    ></textarea>
                    
                    <div class="flex items-center justify-between mt-4">
                        <div class="flex gap-2">
                            <button onclick="loadSample('good')" class="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Load Good Example</button>
                            <button onclick="loadSample('bad')" class="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">Load Bad Example</button>
                        </div>
                        <button 
                            type="button" 
                            onclick="runAudit()" 
                            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            Run Compliance Check
                        </button>
                    </div>
                </div>

                <!-- Result Area -->
                <div id="auditResult" class="hidden">
                    <!-- Populated by JS -->
                </div>
            </div>

            <!-- Info Sidebar -->
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                    <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        What We Check
                    </h4>
                    <ul class="space-y-2 text-xs text-gray-700">
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>Brand voice & tone consistency</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>Color palette adherence</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>Prohibited terminology</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>Messaging alignment</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            <span>Legal compliance markers</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-white rounded-2xl border border-gray-200 p-5">
                    <h4 class="text-sm font-semibold text-gray-900 mb-3">Recent Audits</h4>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-medium text-gray-900 truncate">Email Campaign</p>
                                <p class="text-xs text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-medium text-gray-900 truncate">Social Post</p>
                                <p class="text-xs text-gray-500">5 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const samples = {
            good: "Check out our new product launch! 🚀\\n\\nWe're excited to introduce our latest innovation designed with you in mind. Built with care, tested rigorously, and ready to transform your workflow.\\n\\nBrand Colors: #FF6B6B, #4ECDC4\\nTone: Professional yet approachable",
            bad: "BUY NOW!!! LIMITED TIME OFFER!!!\\n\\nDon't miss out on this AMAZING deal! Our competitors HATE us for this price!\\n\\nColors: #FF0000, #00FF00\\nTone: URGENT AGGRESSIVE SALES"
        };

        function loadSample(type) {
            document.getElementById('auditContent').value = samples[type];
        }

        async function runAudit() {
            const btn = event.currentTarget;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = \`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Analyzing...\`;
            btn.disabled = true;
            const text = document.getElementById('auditContent').value;

            try {
                const res = await fetch('/api/apps/meauxsafe/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                const result = await res.json();
                
                const resultDiv = document.getElementById('auditResult');
                resultDiv.className = 'block animate-fade-in';
                
                if (result.status === 'PASS') {
                    resultDiv.innerHTML = \`
                        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-8">
                            <div class="flex items-start gap-4">
                                <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-2xl font-bold text-green-900 mb-2">✓ Compliance Passed</h3>
                                    <p class="text-green-700 text-lg mb-4">This content aligns perfectly with your brand guidelines.</p>
                                    <div class="bg-white/50 rounded-xl p-4 border border-green-200">
                                        <p class="text-sm text-green-800"><strong>Score:</strong> 98/100</p>
                                        <p class="text-sm text-green-800 mt-1"><strong>Confidence:</strong> High</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                } else {
                    resultDiv.innerHTML = \`
                        <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-8">
                            <div class="flex items-start gap-4">
                                <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-2xl font-bold text-red-900 mb-2">⚠ Compliance Violations Found</h3>
                                    <p class="text-red-700 mb-4">Please address the following issues:</p>
                                    <div class="bg-white rounded-xl p-4 border border-red-200">
                                        <ul class="space-y-2">
                                            \${result.violations.map(v => \`
                                                <li class="flex items-start gap-2 text-sm text-red-800">
                                                    <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                    <span>\${v}</span>
                                                </li>
                                            \`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                }

            } catch (err) {
                alert('Audit Failed: ' + err.message);
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        }
    </script>
    `;

    return getLayout({
        title: 'MeauxSAFE - MeauxCLOUD',
        bodyContent: content,
        activeItem: 'meauxsafe',
        user: user
    });
}
