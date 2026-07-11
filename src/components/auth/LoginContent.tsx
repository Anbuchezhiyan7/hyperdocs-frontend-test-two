'use client';

import { useState, useEffect } from 'react';
import { HyperblogLogo, GoogleIcon } from '@/assets/icons';
import { useAuth } from '@/providers/auth.provider';
import { useQueryState } from 'nuqs';
import { apiEmailLogin } from '@/api/auth';
import { isValidEmail } from '@/utils/validate';
import { showToast } from '../common/Toast';
import { useAppStore } from '@/store/useAppStore';
import { setCookie } from '@/utils/cookie';
import Button from '../common/Buttons';

const ROTATING_WORDS = ['Write.', 'Optimize.', 'Publish.', 'Convert.'];

const LoginContent = () => {
    const { setUserData } = useAppStore();
    const { isLoading, loginWithGoogle } = useAuth();

    const [_, setParamMode] = useQueryState('mode');
    const [email, setEmail] = useState('');
    const [isContinuing, setIsContinuing] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [wordVisible, setWordVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIndex(i => (i + 1) % ROTATING_WORDS.length);
                setWordVisible(true);
            }, 400);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleContinue = async () => {
        setIsContinuing(true);
        const response = await apiEmailLogin(email);
        const { message, type, success, data } = response;
        if (success) {
            localStorage.setItem('otp_email', email);
            localStorage.setItem('otp_expiry', (Date.now() + 300 * 1000).toString());
            setParamMode('verify-otp');
            setCookie('user', JSON.stringify(data), { expires: 30 });
            setUserData(data);
        }
        showToast(message, type);
        setIsContinuing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && isValidEmail(email) && !isContinuing) {
            handleContinue();
        }
    };

    return (
        <div className="auth-split-root">
            {/* ── LEFT PANEL ── */}
            <div className="auth-left-panel">
                <div className="auth-left-glow-1" />
                <div className="auth-left-glow-2" />
                <div className="auth-left-glow-3" />
                <div className="auth-particles">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <span key={i} className="auth-particle" style={{
                            '--delay': `${(i * 0.37) % 4}s`,
                            '--x': `${10 + (i * 53) % 80}%`,
                            '--size': `${3 + (i * 7) % 5}px`,
                            '--dur': `${6 + (i * 3) % 6}s`,
                        } as React.CSSProperties} />
                    ))}
                </div>
                <div className="auth-left-content">
                    <div className="auth-left-badge">
                        <span className="auth-badge-dot" />
                        Content Platform
                    </div>
                    <h1 className="auth-left-headline">
                        From Writing
                        <br />
                        to <span className="auth-left-accent">Leads.</span>
                    </h1>
                    <div className="auth-rotating-word-wrap">
                        <span
                            className="auth-rotating-word"
                            style={{ opacity: wordVisible ? 1 : 0, transform: wordVisible ? 'translateY(0)' : 'translateY(10px)' }}
                        >
                            {ROTATING_WORDS[wordIndex]}
                        </span>
                        <span className="auth-rotating-subtitle"> all in one place.</span>
                    </div>

                    <div className="auth-left-features">
                        {[
                            { icon: '✍️', text: 'Rich text editor built for marketers' },
                            { icon: '🔍', text: 'SEO-first publishing workflow' },
                            { icon: '📈', text: 'Built-in lead capture & analytics' },
                        ].map(({ icon, text }) => (
                            <div key={text} className="auth-feature-row">
                                <span className="auth-feature-icon">{icon}</span>
                                <span className="auth-feature-text">{text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-left-avatars">
                        {['A', 'B', 'C', 'D'].map((l, i) => (
                            <div key={l} className="auth-avatar" style={{ '--i': i } as React.CSSProperties}>{l}</div>
                        ))}
                        <span className="auth-avatar-text">Trusted by 10,000+ creators</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right-panel">
                <div className="auth-right-card">
                    <div className="auth-card-logo">
                        <HyperblogLogo className="w-[160px]" />
                    </div>

                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Welcome back</h2>
                        <p className="auth-card-subtitle">Sign in to your Hyperblog workspace</p>
                    </div>

                    {/* Google */}
                    <Button
                        className="auth-google-btn"
                        icon={<GoogleIcon />}
                        disabled={isContinuing}
                        loading={isLoading}
                        onClick={loginWithGoogle}
                    >
                        Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">or use email</span>
                        <div className="auth-divider-line" />
                    </div>

                    {/* Email */}
                    <div className="auth-input-group">
                        <label className="auth-input-label">Email address</label>
                        <div className="auth-input-wrap">
                            <svg className="auth-input-icon" viewBox="0 0 20 20" fill="none">
                                <path d="M2.5 5.5A1.5 1.5 0 014 4h12a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" strokeWidth="1.2" />
                                <path d="M2.5 6l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="auth-input"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoComplete="email"
                                id="login-email"
                            />
                        </div>
                        <p className="auth-input-hint">We&apos;ll send a 6-digit OTP to verify</p>
                    </div>

                    <button
                        className="auth-cta-btn"
                        onClick={handleContinue}
                        disabled={!isValidEmail(email) || isLoading || isContinuing}
                        id="login-continue-btn"
                    >
                        {isContinuing ? (
                            <span className="auth-cta-spinner" />
                        ) : (
                            <>
                                Continue
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="auth-terms">
                        By continuing you agree to our{' '}
                        <span className="auth-terms-link">Terms of Service</span> and{' '}
                        <span className="auth-terms-link">Privacy Policy</span>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .auth-split-root {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                    background: #09090f;
                    font-family: 'Inter', 'Plus Jakarta Sans', sans-serif;
                }

                /* ─── LEFT PANEL ─── */
                .auth-left-panel {
                    position: relative;
                    width: 48%;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a0a00 0%, #2d1100 40%, #1a0500 100%);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 56px;
                }

                .auth-left-glow-1 {
                    position: absolute;
                    width: 500px;
                    height: 500px;
                    top: -150px;
                    left: -150px;
                    background: radial-gradient(circle, rgba(255, 82, 0, 0.35) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: glowPulse 6s ease-in-out infinite;
                }
                .auth-left-glow-2 {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    bottom: -120px;
                    right: -80px;
                    background: radial-gradient(circle, rgba(255, 138, 0, 0.25) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: glowPulse 8s ease-in-out infinite reverse;
                }
                .auth-left-glow-3 {
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(circle, rgba(255, 60, 0, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: glowPulse 4s ease-in-out infinite 2s;
                }
                @keyframes glowPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                .auth-left-glow-2 { animation-name: glowPulse2; }
                @keyframes glowPulse2 {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2) rotate(10deg); opacity: 0.6; }
                }

                /* Particles */
                .auth-particles {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .auth-particle {
                    position: absolute;
                    left: var(--x);
                    bottom: -10px;
                    width: var(--size);
                    height: var(--size);
                    background: rgba(255, 120, 30, 0.7);
                    border-radius: 50%;
                    animation: floatUp var(--dur) var(--delay) ease-in infinite;
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.8; }
                    80% { opacity: 0.3; }
                    100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
                }

                .auth-left-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }

                .auth-left-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 82, 0, 0.15);
                    border: 1px solid rgba(255, 82, 0, 0.3);
                    border-radius: 100px;
                    padding: 6px 16px;
                    color: #FF8A40;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    width: fit-content;
                }
                .auth-badge-dot {
                    width: 6px;
                    height: 6px;
                    background: #FF5200;
                    border-radius: 50%;
                    box-shadow: 0 0 6px #FF5200;
                    animation: dotBlink 2s ease-in-out infinite;
                }
                @keyframes dotBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                .auth-left-headline {
                    font-size: 48px;
                    font-weight: 800;
                    line-height: 1.1;
                    color: #ffffff;
                    letter-spacing: -0.02em;
                    margin: 0;
                }
                .auth-left-accent {
                    background: linear-gradient(90deg, #FF5200, #FF8A00);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .auth-rotating-word-wrap {
                    font-size: 20px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.5);
                    min-height: 32px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .auth-rotating-word {
                    color: #FF8A40;
                    transition: opacity 0.4s ease, transform 0.4s ease;
                    display: inline-block;
                    min-width: 110px;
                }
                .auth-rotating-subtitle {
                    color: rgba(255,255,255,0.4);
                    font-weight: 400;
                }

                .auth-left-features {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .auth-feature-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .auth-feature-icon {
                    font-size: 18px;
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 82, 0, 0.12);
                    border: 1px solid rgba(255, 82, 0, 0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .auth-feature-text {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.65);
                    font-weight: 450;
                }

                .auth-left-avatars {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 8px;
                }
                .auth-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #FF5200, #FF8A00);
                    border: 2px solid rgba(255,82,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: white;
                    margin-left: calc(var(--i) * -8px);
                    position: relative;
                    z-index: calc(4 - var(--i));
                }
                .auth-avatar-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.5);
                    margin-left: 12px;
                }

                /* ─── RIGHT PANEL ─── */
                .auth-right-panel {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 24px;
                    background: #09090f;
                }

                .auth-right-card {
                    width: 100%;
                    max-width: 420px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 40px 36px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    animation: cardSlideIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                    box-shadow: 0 0 60px rgba(255, 82, 0, 0.06), 0 0 120px rgba(0,0,0,0.6);
                }
                @keyframes cardSlideIn {
                    from { opacity: 0; transform: translateX(30px) scale(0.98); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }

                .auth-card-logo { display: flex; align-items: center; }

                .auth-card-header { display: flex; flex-direction: column; gap: 6px; }
                .auth-card-title {
                    font-size: 26px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .auth-card-subtitle {
                    font-size: 14px;
                    color: rgba(255,255,255,0.45);
                    margin: 0;
                    font-weight: 400;
                }

                /* Google btn override */
                .auth-google-btn {
                    width: 100% !important;
                    height: 48px !important;
                    background: rgba(255,255,255,0.06) !important;
                    border: 1px solid rgba(255,255,255,0.12) !important;
                    border-radius: 12px !important;
                    color: rgba(255,255,255,0.85) !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    transition: all 0.2s ease !important;
                    cursor: pointer !important;
                }
                .auth-google-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.1) !important;
                    border-color: rgba(255,255,255,0.2) !important;
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.08);
                }
                .auth-divider-text {
                    font-size: 12px;
                    color: rgba(255,255,255,0.3);
                    white-space: nowrap;
                    font-weight: 500;
                }

                .auth-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .auth-input-label {
                    font-size: 13px;
                    font-weight: 500;
                    color: rgba(255,255,255,0.6);
                }
                .auth-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .auth-input-icon {
                    position: absolute;
                    left: 14px;
                    width: 16px;
                    height: 16px;
                    color: rgba(255,255,255,0.3);
                    pointer-events: none;
                }
                .auth-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px 0 40px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    font-size: 14px;
                    color: #ffffff;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                    font-family: inherit;
                }
                .auth-input::placeholder { color: rgba(255,255,255,0.2); }
                .auth-input:focus {
                    border-color: rgba(255, 82, 0, 0.6);
                    box-shadow: 0 0 0 3px rgba(255, 82, 0, 0.1);
                    background: rgba(255,255,255,0.07);
                }
                .auth-input-hint {
                    font-size: 12px;
                    color: rgba(255,255,255,0.25);
                    margin: 0;
                }

                .auth-cta-btn {
                    width: 100%;
                    height: 50px;
                    background: linear-gradient(135deg, #FF5200, #FF7A00);
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                    letter-spacing: 0.01em;
                    box-shadow: 0 4px 20px rgba(255, 82, 0, 0.35);
                }
                .auth-cta-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transition: left 0.5s ease;
                }
                .auth-cta-btn:hover:not(:disabled)::before { left: 100%; }
                .auth-cta-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 30px rgba(255, 82, 0, 0.45);
                }
                .auth-cta-btn:active:not(:disabled) { transform: translateY(0); }
                .auth-cta-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    box-shadow: none;
                }
                .auth-cta-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .auth-terms {
                    font-size: 12px;
                    color: rgba(255,255,255,0.25);
                    text-align: center;
                    margin: 0;
                    line-height: 1.5;
                }
                .auth-terms-link {
                    color: rgba(255,82,0,0.7);
                    cursor: pointer;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .auth-terms-link:hover { color: #FF5200; }

                /* ─── RESPONSIVE ─── */
                @media (max-width: 768px) {
                    .auth-split-root { flex-direction: column; }
                    .auth-left-panel {
                        width: 100%;
                        min-height: 200px;
                        padding: 40px 28px;
                    }
                    .auth-left-headline { font-size: 30px; }
                    .auth-left-features { display: none; }
                    .auth-left-avatars { display: none; }
                    .auth-right-panel { padding: 32px 16px; }
                    .auth-right-card { padding: 28px 20px; border-radius: 20px; }
                }
            `}</style>
        </div>
    );
};

export default LoginContent;
