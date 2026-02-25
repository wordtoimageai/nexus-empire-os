<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{domain}} - {{niche}} Platform</title>
    <meta name="description" content="Premium {{niche}} solutions powered by AI technology.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, system-ui, sans-serif; 
            line-height: 1.6; 
            color: #e5e7eb;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        header { padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo { font-size: 24px; font-weight: 700; color: white; }
        .hero { text-align: center; padding: 120px 0 80px; }
        .hero h1 { font-size: 56px; font-weight: 700; color: white; margin-bottom: 24px; }
        .hero p { font-size: 20px; color: #94a3b8; max-width: 600px; margin: 0 auto 40px; }
        .cta-button { 
            display: inline-block; background: #3b82f6; color: white; 
            padding: 16px 32px; border-radius: 50px; text-decoration: none; 
            font-weight: 600; font-size: 18px; border: none; cursor: pointer;
        }
        .email-capture { max-width: 500px; margin: 40px auto 0; display: flex; gap: 12px; }
        .email-input { 
            flex: 1; padding: 16px 24px; border-radius: 50px; 
            border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05);
            color: white; font-size: 16px;
        }
        .features { padding: 80px 0; background: rgba(255,255,255,0.02); }
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 32px; 
        }
        .feature-card { 
            padding: 32px; background: rgba(255,255,255,0.05); 
            border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
        }
        .feature-card h3 { font-size: 20px; color: white; margin: 16px 0 12px; }
        .feature-card p { color: #94a3b8; }
        footer { padding: 40px 0; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); color: #64748b; }
        @media (max-width: 768px) {
            .hero h1 { font-size: 36px; }
            .email-capture { flex-direction: column; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">{{domain}}</div>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>{{headline}}</h1>
            <p>{{subheadline}}</p>
            <form class="email-capture">
                <input type="email" class="email-input" placeholder="Enter your email" required>
                <button type="submit" class="cta-button">Get Early Access</button>
            </form>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <h3>🚀 AI-Powered</h3>
                    <p>Leverage cutting-edge artificial intelligence to automate your workflow.</p>
                </div>
                <div class="feature-card">
                    <h3>⚡ Lightning Fast</h3>
                    <p>Optimized for speed with 99.9% uptime guarantee.</p>
                </div>
                <div class="feature-card">
                    <h3>🔒 Secure & Private</h3>
                    <p>Enterprise-grade security with end-to-end encryption.</p>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 {{domain}}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>