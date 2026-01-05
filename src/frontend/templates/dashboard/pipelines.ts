import { getLayout } from '../layout';
import type { UserSession } from '../../../middleware/session';

export function getPipelinesPage(env: any, user: UserSession) {
    const content = `
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-gray-900">Data Pipelines</h1>
            <p class="text-gray-500 mt-2">Manage high-throughput data ingestion streams via Cloudflare Pipelines.</p>
        </div>
        <div>
             <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Healthy
             </span>
        </div>
    </div>

    <!-- Pipeline Card -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-peach-100 p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div class="absolute top-0 right-0 p-4 opacity-50">
                <svg class="w-16 h-16 text-peach-100" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.4-1.4 2.6 2.6L16.6 9.6 18 11l-8 6z"/></svg>
            </div>
            
            <div class="relative z-10">
                <h3 class="text-lg font-bold text-gray-900 mb-1">MeauxCloud Stream</h3>
                <p class="text-xs text-gray-500 font-mono mb-4">ID: 788cb957...38d6</p>
                
                <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Status</span>
                        <span class="text-green-600 font-semibold">Active</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Binding</span>
                        <span class="text-gray-900 font-mono text-xs bg-gray-50 px-2 py-0.5 rounded">MEAUXCLOUDPIPELINE_STREAM</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Throughput</span>
                        <span class="text-gray-900">0 events/sec</span>
                    </div>
                </div>

                <div class="mt-6 flex gap-3">
                    <button class="flex-1 px-4 py-2 bg-peach-50 text-peach-600 rounded-lg text-sm font-semibold hover:bg-peach-100 transition-colors">
                        View Logs
                    </button>
                    <button class="flex-1 px-4 py-2 bg-peach-500 text-white rounded-lg text-sm font-semibold hover:bg-peach-600 transition-colors flex items-center justify-center gap-2" onclick="testPipeline()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Test Event
                    </button>
                </div>
            </div>
        </div>

        <!-- Add New Placeholder -->
        <div class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:border-peach-300 transition-colors cursor-pointer group">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-peach-500 mb-3 shadow-sm group-hover:scale-110 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-900">Create New Pipeline</h3>
            <p class="text-xs text-gray-500 mt-1">Connect a new data source</p>
        </div>
    </div>

    <!-- Analytics / Chart Placeholder -->
    <div class="bg-white rounded-xl shadow-sm border border-peach-100 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Ingestion Analytics</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
            <p class="text-gray-400 text-sm">Real-time metrics coming soon</p>
        </div>
    </div>

    <script>
        async function testPipeline() {
            alert('Test function will send a dummy event to the pipeline binding pipeline.send(...)');
            // TODO: Implement backend route /api/pipelines/test
        }
    </script>
  `;

    return getLayout({
        title: 'Pipelines - MeauxCLOUD',
        bodyContent: content,
        activeItem: 'pipelines',
        user: user
    });
}
