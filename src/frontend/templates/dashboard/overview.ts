import { getLayout } from '../layout';
import type { Env } from '../../../../types/env';

export function getDashboard(env: Env, user?: any) {
    const content = `
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Projects -->
        <div class="stat-card">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-peach-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-peach-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Total Projects</div>
                    <div class="text-3xl font-bold text-gray-900" id="stat-projects">...</div>
                    <div class="text-xs text-green-600 mt-1">↑ 12% from last month</div>
                </div>
            </div>
        </div>

        <!-- Team Members -->
        <div class="stat-card">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Team Members</div>
                    <div class="text-3xl font-bold text-gray-900">8</div>
                    <div class="text-xs text-green-600 mt-1">↑ 2 new this week</div>
                </div>
            </div>
        </div>

        <!-- Storage Used -->
        <div class="stat-card">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                    </svg>
                </div>
                <div>
                    <div class="text-sm text-gray-500">Storage Used</div>
                    <div class="text-3xl font-bold text-gray-900">2.4 GB</div>
                    <div class="text-xs text-gray-500 mt-1">of 10 GB total</div>
                </div>
            </div>
        </div>

        <!-- API Requests -->
        <div class="stat-card">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <div>
                    <div class="text-sm text-gray-500">API Requests</div>
                    <div class="text-3xl font-bold text-gray-900">45.2K</div>
                    <div class="text-xs text-green-600 mt-1">↑ 8% this week</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity + Meetings -->
    <div class="grid lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
                <a href="#" class="text-sm text-peach-600 hover:text-peach-700 font-medium">View All</a>
            </div>
            <div class="text-center py-12 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p>Activity feed will appear here</p>
            </div>
        </div>

        <!-- Upcoming Meetings -->
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Upcoming Meetings</h2>
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-peach-500 rounded-full"></div>
                        <div>
                            <div class="font-medium text-gray-900">Client Call</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">Today, 9:00 PM</div>
                </div>
                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-peach-500 rounded-full"></div>
                        <div>
                            <div class="font-medium text-gray-900">Team Meeting</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">Apr 25, 10:00 AM</div>
                </div>
                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-peach-500 rounded-full"></div>
                        <div>
                            <div class="font-medium text-gray-900">Product Demo</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">Apr 26, 2:00 PM</div>
                </div>
                <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 bg-peach-500 rounded-full"></div>
                        <div>
                            <div class="font-medium text-gray-900">Contract Review</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">Apr 27, 11:30 AM</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="flex gap-4 mt-8">
        <button class="flex items-center gap-2 px-6 py-3 bg-peach-500 hover:bg-peach-600 text-white rounded-lg font-semibold transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
            </svg>
            CLI
        </button>
        <button class="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold border border-gray-200 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Agent
        </button>
    </div>

    <script>
      // Populate dynamic data
      fetch('/api/projects').then(r => r.json()).then(data => {
         const count = data.length || 0;
         document.getElementById('stat-projects').innerText = count;
      });
    </script>
  `;

    return getLayout({
        title: 'Dashboard - MeauxCLOUD',
        bodyContent: content,
        activeItem: 'dashboard',
        user: user,
        isPublic: false
    });
}
