export function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MeauxCLOUD - Galaxy Portal</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      overflow: hidden;
      background: #000;
      color: #fff;
    }
    
    /* Galaxy Background */
    #galaxy-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    
    /* Main Container */
    .portal-container {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    /* Login Card */
    .login-card {
      background: rgba(15, 15, 25, 0.85);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 32px;
      padding: 60px 50px;
      width: 100%;
      max-width: 480px;
      box-shadow: 
        0 0 80px rgba(242, 122, 79, 0.3),
        0 0 40px rgba(139, 92, 246, 0.2),
        inset 0 0 60px rgba(255, 255, 255, 0.02);
      position: relative;
      overflow: hidden;
      animation: cardFloat 6s ease-in-out infinite;
    }
    
    @keyframes cardFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    /* Glow Effect */
    .login-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(242, 122, 79, 0.15) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
      pointer-events: none;
    }
    
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Logo */
    .logo-container {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }
    
    .logo {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      border-radius: 24px;
      background: linear-gradient(135deg, #f27a4f 0%, #8b5cf6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 900;
      box-shadow: 
        0 20px 60px rgba(242, 122, 79, 0.4),
        0 0 40px rgba(139, 92, 246, 0.3);
      animation: logoGlow 3s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }
    
    .logo::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
      animation: shimmer 3s infinite;
    }
    
    @keyframes logoGlow {
      0%, 100% { box-shadow: 0 20px 60px rgba(242, 122, 79, 0.4), 0 0 40px rgba(139, 92, 246, 0.3); }
      50% { box-shadow: 0 20px 80px rgba(242, 122, 79, 0.6), 0 0 60px rgba(139, 92, 246, 0.5); }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
    
    h1 {
      font-size: 36px;
      font-weight: 800;
      background: linear-gradient(135deg, #fff 0%, #f27a4f 50%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    
    .subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 16px;
      margin-bottom: 48px;
      font-weight: 400;
    }
    
    /* Auth Buttons */
    .auth-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      z-index: 1;
    }
    
    .auth-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 18px 32px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    
    .auth-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    
    .auth-btn:hover::before {
      left: 100%;
    }
    
    .auth-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(242, 122, 79, 0.5);
      transform: translateY(-2px);
      box-shadow: 
        0 10px 40px rgba(242, 122, 79, 0.3),
        0 0 20px rgba(139, 92, 246, 0.2);
    }
    
    .auth-btn svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 32px 0;
      color: rgba(255, 255, 255, 0.3);
      font-size: 14px;
      font-weight: 500;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    }
    
    .divider span {
      padding: 0 20px;
    }
    
    /* Particles */
    .particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }
    
    /* Footer */
    .footer {
      position: fixed;
      bottom: 30px;
      left: 0;
      right: 0;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 13px;
      z-index: 5;
    }
    
    /* Responsive */
    @media (max-width: 640px) {
      .login-card {
        padding: 40px 30px;
      }
      
      h1 {
        font-size: 28px;
      }
      
      .logo {
        width: 80px;
        height: 80px;
        font-size: 40px;
      }
    }
  </style>
</head>
<body>
  <canvas id="galaxy-canvas"></canvas>
  
  <div class="portal-container">
    <div class="login-card">
      <div class="logo-container">
        <div class="logo">M</div>
        <h1>MeauxCLOUD</h1>
        <p class="subtitle">Enter the Galaxy Portal</p>
      </div>
      
      <div class="auth-buttons">
        <a href="/api/auth/google" class="auth-btn">
          <svg viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>
        
        <div class="divider"><span>OR</span></div>
        
        <a href="/api/auth/github" class="auth-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </a>
      </div>
    </div>
  </div>
  
  <div class="footer">
    Powered by Cloudflare Workers • Secured with OAuth 2.0
  </div>
  
  <script>
    // Galaxy Canvas Animation
    const canvas = document.getElementById('galaxy-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    
    // Stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random()
      });
    }
    
    // Particles
    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? 'rgba(242, 122, 79, 0.6)' : 'rgba(139, 92, 246, 0.6)'
      });
    }
    
    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = \`rgba(255, 255, 255, \${star.opacity})\`;
        ctx.fill();
        
        star.x += star.vx;
        star.y += star.vy;
        
        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.3, Math.min(1, star.opacity));
      });
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          particle.vx -= dx * 0.0001;
          particle.vy -= dy * 0.0001;
        }
      });
    });
  </script>
</body>
</html>`;
}
