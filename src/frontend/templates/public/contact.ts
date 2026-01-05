import { getPublicNav, getPublicFooter } from '../components/public-nav';

export function getContactPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact - MeauxCLOUD</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="font-sans antialiased bg-gray-900">
  ${getPublicNav('contact', 'dark')}
  
  <section class="pt-32 pb-20 px-6 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-white mb-4">Get in Touch</h1>
        <p class="text-xl text-gray-400">We'd love to hear from you</p>
      </div>
      
      <div class="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Name</label>
            <input type="text" required class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="John Doe">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Email</label>
            <input type="email" required class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="john@example.com">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Message</label>
            <textarea required rows="6" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none" placeholder="Tell us about your project..."></textarea>
          </div>
          
          <button type="submit" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors">
            Send Message
          </button>
        </form>
        
        <div class="mt-12 pt-8 border-t border-white/10 text-center">
          <p class="text-gray-400 mb-4">Or email us directly at</p>
          <a href="mailto:meauxbility@gmail.com" class="text-blue-400 hover:text-blue-300 font-semibold text-lg">meauxbility@gmail.com</a>
        </div>
      </div>
    </div>
  </section>
  
  ${getPublicFooter('dark')}
</body>
</html>`;
}
