import { getLayout } from '../layout';
import type { UserSession } from '../../../middleware/session';

export function getBrainPage(env: any, user: UserSession) {
    const content = `
    <div class="max-w-4xl mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Brain Ingestion</h1>
        <p class="text-gray-500 mt-2">Feed the AI your raw documents, brand guidelines, and planning conversations. It will embed them into long-term memory.</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-peach-100 p-6">
        <form id="ingestForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Content Source / Title</label>
                <input type="text" id="source" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500 outline-none transition-all" placeholder="e.g. Brand Guidelines V1">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Raw Content</label>
                <textarea id="content" rows="15" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-peach-500 outline-none transition-all font-mono text-sm" placeholder="Paste your massive text dump here..."></textarea>
            </div>

            <div class="flex items-center justify-between pt-4">
                <div id="status" class="text-sm text-gray-500">Ready to ingest.</div>
                <button type="submit" class="px-6 py-2 bg-peach-500 hover:bg-peach-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    Vectorize & Save
                </button>
            </div>
        </form>
      </div>
    </div>

    <script>
        document.getElementById('ingestForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.submitter;
            const status = document.getElementById('status');
            const content = document.getElementById('content').value;
            
            if (!content) return alert('Please paste some content.');

            btn.disabled = true;
            btn.innerHTML = 'Processing...';
            status.textContent = 'Generating Embeddings via Gemini...';
            status.className = 'text-sm text-peach-600 font-medium';

            try {
                const res = await fetch('/api/brain/ingest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    status.textContent = 'Success! Saved to Supabase Knowledge Base.';
                    status.className = 'text-sm text-green-600 font-bold';
                    document.getElementById('content').value = ''; // Clear
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (err) {
                status.textContent = 'Error: ' + err.message;
                status.className = 'text-sm text-red-600 font-bold';
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Vectorize & Save';
            }
        });
    </script>
  `;

    return getLayout({
        title: 'Brain Ingestion - MeauxCLOUD',
        bodyContent: content,
        activeItem: 'settings', // Highlight generic item
        user: user
    });
}
