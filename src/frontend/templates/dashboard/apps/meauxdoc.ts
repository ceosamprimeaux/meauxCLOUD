import { getLayout, html } from '../../layout';
import type { UserSession } from '../../../../middleware/session';

export function getMeauxDocPage(env: any, user: UserSession) {
    const content = html`
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Meaux<span class="text-amber-500">DOC</span></h1>
                <p class="text-gray-500 mt-1">Instant PDF Generation for Invoices & Contracts</p>
            </div>
            <div>
                <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100 flex items-center gap-2">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    PDF Engine Ready
                </span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Input Form -->
            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-amber-100/50 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Document Details</h3>
                    <form id="docForm" class="space-y-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Document Type</label>
                            <select id="docType" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm">
                                <option value="invoice">📄 Invoice</option>
                                <option value="contract">📋 Service Contract</option>
                                <option value="proposal">💼 Project Proposal</option>
                                <option value="receipt">🧾 Payment Receipt</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Client Name</label>
                            <input type="text" id="clientName" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm" placeholder="Acme Corporation">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount ($)</label>
                            <input type="number" id="price" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm" placeholder="5000.00" step="0.01">
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description / Notes</label>
                            <textarea id="description" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all text-sm resize-none" placeholder="Web development services for Q1 2026..."></textarea>
                        </div>
                        
                        <button type="submit" class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            Generate PDF Document
                        </button>
                    </form>
                </div>

                <!-- Quick Templates -->
                <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
                    <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Quick Templates
                    </h4>
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="loadTemplate('consulting')" class="px-3 py-2 bg-white hover:bg-amber-50 rounded-lg text-xs font-medium text-gray-700 border border-amber-200 transition-colors">Consulting</button>
                        <button onclick="loadTemplate('design')" class="px-3 py-2 bg-white hover:bg-amber-50 rounded-lg text-xs font-medium text-gray-700 border border-amber-200 transition-colors">Design Work</button>
                        <button onclick="loadTemplate('development')" class="px-3 py-2 bg-white hover:bg-amber-50 rounded-lg text-xs font-medium text-gray-700 border border-amber-200 transition-colors">Development</button>
                        <button onclick="loadTemplate('retainer')" class="px-3 py-2 bg-white hover:bg-amber-50 rounded-lg text-xs font-medium text-gray-700 border border-amber-200 transition-colors">Retainer</button>
                    </div>
                </div>
            </div>

            <!-- Preview Area -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-1 h-[600px] relative overflow-hidden">
                <div id="resultArea" class="w-full h-full rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div class="text-center">
                        <div class="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-gray-200">
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p class="text-gray-600 font-medium">Ready to Generate</p>
                        <p class="text-gray-400 text-sm mt-1">Fill out the form to create your document</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const templates = {
            consulting: { client: 'Strategic Consulting Inc.', amount: 7500, desc: 'Business strategy consulting for Q1 2026' },
            design: { client: 'Creative Agency LLC', amount: 3500, desc: 'Brand identity design and logo development' },
            development: { client: 'Tech Startup Co.', amount: 12000, desc: 'Full-stack web application development' },
            retainer: { client: 'Enterprise Client', amount: 5000, desc: 'Monthly retainer for ongoing support and maintenance' }
        };

        function loadTemplate(type) {
            const t = templates[type];
            document.getElementById('clientName').value = t.client;
            document.getElementById('price').value = t.amount;
            document.getElementById('description').value = t.desc;
        }

        document.getElementById('docForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.submitter;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = \`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...\`;
            btn.disabled = true;

            const data = {
                type: document.getElementById('docType').value,
                clientName: document.getElementById('clientName').value,
                price: document.getElementById('price').value,
                description: document.getElementById('description').value
            };

            try {
                const res = await fetch('/api/apps/meauxdoc/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                const resultArea = document.getElementById('resultArea');
                if (result.status === 'generated') {
                    resultArea.innerHTML = \`
                        <div class="flex flex-col items-center justify-center h-full p-8">
                            <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce-once">
                                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">Document Generated!</h3>
                            <p class="text-gray-500 mb-6">\${result.message}</p>
                            <a href="\${result.url}" target="_blank" class="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                Download PDF
                            </a>
                        </div>
                    \`;
                    resultArea.className = "w-full h-full rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center";
                } else {
                    throw new Error(result.error || 'Unknown error');
                }
            } catch (err) {
                alert('Error: ' + err.message);
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    </script>
    `;

    return getLayout({
        title: 'MeauxDOC - MeauxCLOUD',
        bodyContent: content,
        activeItem: 'meauxdoc',
        user: user
    });
}
