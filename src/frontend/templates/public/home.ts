import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getHomepage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MeauxCLOUD - Cloud API & Integration Platform</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .feature-card { background: rgba(255, 255, 255, 0.95); transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
  </style>
</head>
<body class="font-sans antialiased">
  ${getPublicNav('home', 'light')}
  
  <section class="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="inline-block px-4 py-2 bg-blue-100 rounded-full">
            <span class="text-blue-700 font-semibold text-sm">Cloud Infrastructure Platform</span>
          </div>
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Cloud API<br/><span class="text-blue-600">& Integration</span>
          </h1>
          <p class="text-xl text-gray-600 leading-relaxed">
            Seamlessly integrate and access real-time cloud services with our powerful API.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="/dashboard" class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors">
              Get Started
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="relative p-8 lg:p-12 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-3xl">
          <div class="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div class="flex items-center gap-3 pb-4 border-b">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <span class="flex-1 text-center text-sm text-gray-500 font-mono">MeauxCLOUD API</span>
            </div>
            <div class="space-y-3">
              <div class="h-12 bg-blue-100 rounded-lg flex items-center px-4">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span class="ml-3 text-sm font-medium text-gray-700">Secure Authentication</span>
              </div>
              <div class="h-12 bg-indigo-100 rounded-lg flex items-center px-4">
                <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4zm0-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                </svg>
                <span class="ml-3 text-sm font-medium text-gray-700">Database Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-6 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Seamless Integration</h2>
        <p class="text-xl text-gray-600">Easily connect and use our API to enhance your applications.</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="feature-card rounded-2xl p-8">
          <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Search API</h3>
          <p class="text-gray-600 leading-relaxed">Perform detailed cloud service searches with sub-millisecond latency.</p>
        </div>
        <div class="feature-card rounded-2xl p-8">
          <div class="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Developer Docs</h3>
          <p class="text-gray-600 leading-relaxed">Comprehensive documentation to get your team up and running fast.</p>
        </div>
        <div class="feature-card rounded-2xl p-8">
          <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Real-time Webhooks</h3>
          <p class="text-gray-600 leading-relaxed">Set up webhooks for instant cloud service notifications.</p>
        </div>
      </div>
    </div>
  </section>

  ${getPublicFooter('dark')}
</body>
</html>`;
}
