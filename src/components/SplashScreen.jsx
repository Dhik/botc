'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Show splash for 3 seconds, then transition to menu
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
      setShowMenu(true)
    }, 3000)

    return () => clearTimeout(splashTimer)
  }, [])

  if (showSplash) {
    return (
      <div className="splash-screen">
        {/* Castle Background */}
        <div className="splash-background" />

        {/* Animated Elements */}
        <div className="splash-content">
          {/* Floating Moons */}
          <div className="floating-moon moon-1">🌙</div>
          <div className="floating-moon moon-2">🌙</div>

          {/* Floating Stars */}
          <div className="floating-star star-1">⭐</div>
          <div className="floating-star star-2">✨</div>
          <div className="floating-star star-3">⭐</div>
          <div className="floating-star star-4">✨</div>

          {/* Blood Drops */}
          <div className="blood-drop drop-1">🩸</div>
          <div className="blood-drop drop-2">🩸</div>
          <div className="blood-drop drop-3">🩸</div>

          {/* Main Logo/Title */}
          <div className="splash-logo">
            <div className="logo-castle">🏰</div>
            <h1 className="logo-title">
              <span className="title-blood">BLOOD</span>
              <span className="title-on">on the</span>
              <span className="title-clocktower">CLOCKTOWER</span>
            </h1>
            <div className="logo-subtitle">
              <span className="subtitle-icon">🎭</span>
              <span>Social Deduction Game</span>
              <span className="subtitle-icon">🎭</span>
            </div>

            {/* Loading Animation */}
            <div className="loading-container">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Decorative Characters */}
          <div className="character-left">
            <div className="character-bubble">👻</div>
          </div>
          <div className="character-right">
            <div className="character-bubble">😈</div>
          </div>
        </div>

        <style jsx>{`
          .splash-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
            overflow: hidden;
          }

          .splash-background {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(135deg,
                rgba(20, 10, 30, 0.95) 0%,
                rgba(40, 20, 50, 0.9) 25%,
                rgba(60, 30, 70, 0.85) 50%,
                rgba(40, 20, 50, 0.9) 75%,
                rgba(20, 10, 30, 0.95) 100%
              ),
              radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.2) 0%, transparent 50%);
            animation: backgroundPulse 6s ease-in-out infinite;
          }

          @keyframes backgroundPulse {
            0%, 100% { filter: brightness(0.8); }
            50% { filter: brightness(1.2); }
          }

          .splash-content {
            position: relative;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Floating Moons */
          .floating-moon {
            position: absolute;
            font-size: 4rem;
            animation: floatMoon 4s ease-in-out infinite;
            filter: drop-shadow(0 0 20px rgba(255, 255, 200, 0.8));
          }

          .moon-1 {
            top: 10%;
            left: 15%;
            animation-delay: 0s;
          }

          .moon-2 {
            top: 15%;
            right: 10%;
            animation-delay: 2s;
          }

          @keyframes floatMoon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }

          /* Floating Stars */
          .floating-star {
            position: absolute;
            font-size: 2rem;
            animation: twinkle 2s ease-in-out infinite;
          }

          .star-1 {
            top: 20%;
            left: 25%;
            animation-delay: 0s;
          }

          .star-2 {
            top: 30%;
            right: 20%;
            animation-delay: 0.5s;
          }

          .star-3 {
            bottom: 30%;
            left: 20%;
            animation-delay: 1s;
          }

          .star-4 {
            bottom: 20%;
            right: 25%;
            animation-delay: 1.5s;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }

          /* Blood Drops */
          .blood-drop {
            position: absolute;
            font-size: 2rem;
            animation: drip 3s ease-in infinite;
          }

          .drop-1 {
            top: -5%;
            left: 30%;
            animation-delay: 0s;
          }

          .drop-2 {
            top: -5%;
            left: 50%;
            animation-delay: 1s;
          }

          .drop-3 {
            top: -5%;
            right: 30%;
            animation-delay: 2s;
          }

          @keyframes drip {
            0% {
              transform: translateY(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }

          /* Main Logo */
          .splash-logo {
            text-align: center;
            animation: fadeInScale 1s ease-out;
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .logo-castle {
            font-size: 8rem;
            margin-bottom: 1rem;
            animation: castleBounce 2s ease-in-out infinite;
            filter: drop-shadow(0 0 30px rgba(139, 0, 0, 0.8));
          }

          @keyframes castleBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .logo-title {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 2rem;
          }

          .title-blood {
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff0000, #8b0000, #ff0000);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: bloodGradient 3s ease infinite;
            text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
            letter-spacing: 0.2rem;
          }

          @keyframes bloodGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .title-on {
            font-size: 1.5rem;
            font-weight: 400;
            color: #d4af37;
            font-style: italic;
            letter-spacing: 0.3rem;
          }

          .title-clocktower {
            font-size: 3.5rem;
            font-weight: 800;
            color: #d4af37;
            text-shadow:
              0 0 10px rgba(212, 175, 55, 0.8),
              0 0 20px rgba(212, 175, 55, 0.6),
              0 0 30px rgba(212, 175, 55, 0.4);
            letter-spacing: 0.3rem;
            animation: glow 2s ease-in-out infinite;
          }

          @keyframes glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.3); }
          }

          .logo-subtitle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            font-size: 1.2rem;
            color: #9370db;
            margin-bottom: 2rem;
            animation: subtitlePulse 2s ease-in-out infinite;
          }

          @keyframes subtitlePulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }

          .subtitle-icon {
            font-size: 1.5rem;
            animation: iconRotate 3s linear infinite;
          }

          @keyframes iconRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Loading Animation */
          .loading-container {
            margin-top: 2rem;
          }

          .loading-dots {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
          }

          .loading-dots span {
            width: 12px;
            height: 12px;
            background: linear-gradient(135deg, #ff0000, #8b0000);
            border-radius: 50%;
            animation: loadingBounce 1.4s ease-in-out infinite;
          }

          .loading-dots span:nth-child(1) {
            animation-delay: 0s;
          }

          .loading-dots span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .loading-dots span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes loadingBounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          /* Decorative Characters */
          .character-left,
          .character-right {
            position: absolute;
            font-size: 6rem;
            animation: characterFloat 3s ease-in-out infinite;
          }

          .character-left {
            bottom: 15%;
            left: 10%;
            animation-delay: 0s;
          }

          .character-right {
            bottom: 15%;
            right: 10%;
            animation-delay: 1.5s;
          }

          .character-bubble {
            filter: drop-shadow(0 0 20px rgba(147, 112, 219, 0.8));
          }

          @keyframes characterFloat {
            0%, 100% {
              transform: translateY(0) rotate(-5deg);
            }
            50% {
              transform: translateY(-15px) rotate(5deg);
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .logo-castle { font-size: 5rem; }
            .title-blood { font-size: 2.5rem; }
            .title-on { font-size: 1rem; }
            .title-clocktower { font-size: 2rem; }
            .logo-subtitle { font-size: 0.9rem; }
            .floating-moon { font-size: 2.5rem; }
            .floating-star { font-size: 1.5rem; }
            .character-left, .character-right { font-size: 4rem; }
          }
        `}</style>
      </div>
    )
  }

  if (showMenu) {
    return (
      <div className="main-menu">
        {/* Background */}
        <div className="menu-background" />

        {/* Animated Background Elements */}
        <div className="menu-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }} />
          ))}
        </div>

        {/* Menu Content */}
        <div className="menu-content">
          {/* Header */}
          <div className="menu-header">
            <div className="header-castle">🏰</div>
            <h1 className="header-title">
              <span className="header-blood">BLOOD</span>
              <span className="header-on">on the</span>
              <span className="header-clocktower">CLOCKTOWER</span>
            </h1>
          </div>

          {/* Menu Options */}
          <div className="menu-options">
            <Link
              href="/gm/create"
              className="menu-button menu-button-primary"
              data-href="/gm/create"
            >
              <span className="button-icon">🎭</span>
              <div className="button-content">
                <span className="button-text">Buat Game Baru</span>
                <span className="button-desc">Mulai sebagai Storyteller</span>
              </div>
              <div className="button-glow"></div>
            </Link>

            <Link
              href="/player/join"
              className="menu-button menu-button-secondary"
              data-href="/player/join"
            >
              <span className="button-icon">🎮</span>
              <div className="button-content">
                <span className="button-text">Gabung Game</span>
                <span className="button-desc">Masuk dengan kode room</span>
              </div>
              <div className="button-glow"></div>
            </Link>

            <Link
              href="/games"
              className="menu-button menu-button-tertiary"
              data-href="/games"
            >
              <span className="button-icon">📜</span>
              <div className="button-content">
                <span className="button-text">Game Saya</span>
                <span className="button-desc">Lihat daftar game</span>
              </div>
              <div className="button-glow"></div>
            </Link>

            <Link
              href="/how-to-play"
              className="menu-button menu-button-info"
              data-href="/how-to-play"
            >
              <span className="button-icon">📖</span>
              <div className="button-content">
                <span className="button-text">Cara Bermain</span>
                <span className="button-desc">Panduan lengkap</span>
              </div>
              <div className="button-glow"></div>
            </Link>
          </div>

          {/* Footer */}
          <div className="menu-footer">
            <p className="footer-tagline">
              <span className="tagline-icon">🎭</span>
              Deception, Mystery, and Betrayal
              <span className="tagline-icon">🎭</span>
            </p>
          </div>
        </div>

        <style jsx>{`
          .main-menu {
            position: fixed;
            inset: 0;
            overflow: hidden;
            animation: menuFadeIn 0.5s ease-out;
          }

          @keyframes menuFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .menu-background {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(135deg,
                rgba(10, 5, 15, 0.98) 0%,
                rgba(30, 15, 40, 0.95) 50%,
                rgba(10, 5, 15, 0.98) 100%
              );
          }

          /* Particles */
          .menu-particles {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            animation: particleFloat linear infinite;
          }

          @keyframes particleFloat {
            0% {
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-10vh) scale(1);
              opacity: 0;
            }
          }

          .menu-content {
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            z-index: 10;
          }

          /* Header */
          .menu-header {
            text-align: center;
            margin-bottom: 4rem;
            animation: headerSlideDown 0.8s ease-out;
          }

          @keyframes headerSlideDown {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .header-castle {
            font-size: 5rem;
            margin-bottom: 1rem;
            animation: castleRotate 4s ease-in-out infinite;
            filter: drop-shadow(0 0 20px rgba(139, 0, 0, 0.6));
          }

          @keyframes castleRotate {
            0%, 100% { transform: rotate(-3deg) scale(1); }
            50% { transform: rotate(3deg) scale(1.05); }
          }

          .header-title {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          }

          .header-blood {
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff0000, #8b0000);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 0.2rem;
          }

          .header-on {
            font-size: 1rem;
            color: #d4af37;
            font-style: italic;
            letter-spacing: 0.3rem;
          }

          .header-clocktower {
            font-size: 2.5rem;
            font-weight: 800;
            color: #d4af37;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            letter-spacing: 0.3rem;
          }

          /* Menu Options */
          .menu-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            width: 100%;
            max-width: 900px;
          }

          .menu-button {
            position: relative;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem 2rem;
            border-radius: 15px;
            text-decoration: none;
            transition: all 0.3s ease;
            animation: buttonSlideIn 0.6s ease-out backwards;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          }

          .menu-button:nth-child(1) { animation-delay: 0.2s; }
          .menu-button:nth-child(2) { animation-delay: 0.3s; }
          .menu-button:nth-child(3) { animation-delay: 0.4s; }
          .menu-button:nth-child(4) { animation-delay: 0.5s; }

          @keyframes buttonSlideIn {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .menu-button-primary {
            background: linear-gradient(135deg, #8b0000 0%, #ff0000 100%);
            border: 3px solid #ff4444;
            color: white;
          }

          .menu-button-primary:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow:
              0 15px 40px rgba(255, 0, 0, 0.9),
              0 0 0 12px rgba(255, 68, 68, 0.6),
              0 0 50px rgba(255, 0, 0, 0.5),
              inset 0 0 30px rgba(255, 255, 255, 0.1);
            border-color: #ff8888;
          }

          .menu-button-primary::before {
            background: rgba(255, 100, 100, 0.3);
          }

          .menu-button-secondary {
            background: linear-gradient(135deg, #3d2b6e 0%, #5a3f8e 100%);
            border: 3px solid #7a5fae;
            color: white;
          }

          .menu-button-secondary:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow:
              0 15px 40px rgba(122, 95, 174, 0.9),
              0 0 0 12px rgba(122, 95, 174, 0.6),
              0 0 50px rgba(122, 95, 174, 0.5),
              inset 0 0 30px rgba(255, 255, 255, 0.1);
            border-color: #9a7fce;
          }

          .menu-button-secondary::before {
            background: rgba(154, 127, 206, 0.3);
          }

          .menu-button-tertiary {
            background: linear-gradient(135deg, #2a4a2a 0%, #3d6a3d 100%);
            border: 3px solid #5a8a5a;
            color: white;
          }

          .menu-button-tertiary:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow:
              0 15px 40px rgba(90, 138, 90, 0.9),
              0 0 0 12px rgba(90, 138, 90, 0.6),
              0 0 50px rgba(90, 138, 90, 0.5),
              inset 0 0 30px rgba(255, 255, 255, 0.1);
            border-color: #7aaa7a;
          }

          .menu-button-tertiary::before {
            background: rgba(122, 170, 122, 0.3);
          }

          .menu-button-info {
            background: linear-gradient(135deg, #2a5a6a 0%, #3d7a8a 100%);
            border: 3px solid #5a9aaa;
            color: white;
          }

          .menu-button-info:hover {
            transform: scale(1.08) translateY(-8px);
            box-shadow:
              0 15px 40px rgba(90, 154, 170, 0.9),
              0 0 0 12px rgba(90, 154, 170, 0.6),
              0 0 50px rgba(90, 154, 170, 0.5),
              inset 0 0 30px rgba(255, 255, 255, 0.1);
            border-color: #7abacc;
          }

          .menu-button-info::before {
            background: rgba(122, 186, 204, 0.3);
          }

          .button-icon {
            font-size: 2.5rem;
            animation: iconBounce 2s ease-in-out infinite;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
            position: relative;
            z-index: 2;
          }

          @keyframes iconBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }

          .menu-button:active {
            transform: scale(0.98) translateY(2px);
          }

          .button-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            text-align: left;
            position: relative;
            z-index: 2;
          }

          .button-text {
            font-size: 1.25rem;
            font-weight: 700;
            display: block;
            line-height: 1.2;
          }

          .button-desc {
            font-size: 0.9rem;
            font-weight: 400;
            opacity: 0.85;
            color: rgba(255, 255, 255, 0.8);
            display: block;
            line-height: 1.3;
          }

          .button-glow {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 100%);
            border-radius: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }

          .menu-button:hover .button-glow {
            opacity: 1;
            animation: glowPulse 1.5s ease-in-out infinite;
          }

          @keyframes glowPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          .menu-button::before {
            content: '';
            position: absolute;
            inset: -10px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 20px;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: -1;
            filter: blur(8px);
          }

          .menu-button:hover::before {
            opacity: 1;
          }

          /* Footer */
          .menu-footer {
            margin-top: 4rem;
            animation: footerFadeIn 1s ease-out 0.6s backwards;
          }

          @keyframes footerFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .footer-tagline {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 1.1rem;
            color: #9370db;
            font-style: italic;
          }

          .tagline-icon {
            font-size: 1.5rem;
            animation: taglineRotate 3s linear infinite;
          }

          @keyframes taglineRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .header-castle { font-size: 3rem; }
            .header-blood { font-size: 2rem; }
            .header-on { font-size: 0.8rem; }
            .header-clocktower { font-size: 1.5rem; }
            .menu-options {
              grid-template-columns: 1fr;
              gap: 1rem;
              max-width: 400px;
            }
            .menu-button {
              padding: 1.2rem 1.5rem;
              gap: 1rem;
            }
            .button-icon { font-size: 2rem; }
            .button-text { font-size: 1rem; }
            .button-desc { font-size: 0.8rem; }
            .footer-tagline { font-size: 0.9rem; }
          }
        `}</style>
      </div>
    )
  }

  return null
}
