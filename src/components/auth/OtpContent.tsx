'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HyperblogLogo } from '@/assets/icons';
import { apiResendOtp, apiVerifyOtp } from '@/api/auth';
import { showToast } from '../common/Toast';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import OtpTimer from './Timer';
import { useQueryState } from 'nuqs';

const OTP_LENGTH = 6;

const OtpContent = () => {
    const router = useRouter();
    const { user, setUserData } = useAppStore();
    const [email, setEmailState] = useState(user?.email || '');

    useEffect(() => {
        if (typeof window !== 'undefined' && !email) {
            const savedEmail = localStorage.getItem('otp_email');
            if (savedEmail) setEmailState(savedEmail);
        }
    }, [email]);

    const [paramMode, setParamMode] = useQueryState('mode');
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(() => {
        const expiry = localStorage.getItem('otp_expiry');
        if (expiry) {
            return Math.max(0, Math.floor((Number(expiry) - Date.now()) / 1000));
        }
        return 300;
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isInvalidOTP, setIsInvalidOTP] = useState(false);
    const [shake, setShake] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first box on mount
    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }, []);

    const otp = digits.join('');

    const handleWrongEmail = () => {
        localStorage.removeItem('otp_expiry');
        localStorage.removeItem('otp_email');
        setParamMode(null);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
    };

    const handleDigitChange = (index: number, value: string) => {
        const char = value.replace(/\D/g, '').slice(-1); // only digits, last char
        if (!char) return;
        const newDigits = [...digits];
        newDigits[index] = char;
        setDigits(newDigits);
        if (isInvalidOTP) setIsInvalidOTP(false);
        // Move to next
        if (index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === 'Enter' && otp.length === OTP_LENGTH && !isVerifying) {
            handleVerifyOTP();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        const newDigits = Array(OTP_LENGTH).fill('');
        pasted.split('').forEach((ch, i) => { newDigits[i] = ch; });
        setDigits(newDigits);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputRefs.current[focusIdx]?.focus();
    };

    const hanldeResendOtp = async () => {
        setIsResending(true);
        const res = await apiResendOtp(email);
        if (res.success) {
            const newExpiry = Date.now() + 300 * 1000;
            localStorage.setItem('otp_expiry', newExpiry.toString());
            setTimer(300);
            setDigits(Array(OTP_LENGTH).fill(''));
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
        showToast(res?.message, res.type);
        setIsResending(false);
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        const { type, success, data, message } = await apiVerifyOtp(email, otp);
        if (success) {
            setUserData({ ...user, ...data });
            if (data?.is_new_user) {
                router.push('/site-details');
            } else {
                router.push('/admin/blogs');
            }
        } else {
            setDigits(Array(OTP_LENGTH).fill(''));
            setIsInvalidOTP(true);
            setIsVerifying(false);
            triggerShake();
            showToast(message, type);
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
    };

    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + b.replace(/./g, '•') + c)
        : '';

    return (
        <div className="auth-split-root">
            {/* ── LEFT PANEL ── */}
            <div className="auth-left-panel">
                <div className="auth-left-glow-1" />
                <div className="auth-left-glow-2" />
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
                        Step 2 of 3
                    </div>
                    <h1 className="auth-left-headline">
                        Almost
                        <br />
                        <span className="auth-left-accent">there.</span>
                    </h1>
                    <p className="auth-left-body">
                        We sent a 6-digit code to your email. Enter it on the right to verify and unlock your workspace.
                    </p>
                    <div className="auth-otp-illustration">
                        <div className="auth-otp-shield">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M24 4L8 10v14c0 9.94 6.84 19.24 16 22 9.16-2.76 16-12.06 16-22V10L24 4z" fill="rgba(255,82,0,0.15)" stroke="rgba(255,82,0,0.5)" strokeWidth="1.5" />
                                <path d="M17 24l5 5 9-9" stroke="#FF5200" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="auth-otp-secure-text">Your OTP is end-to-end secured</p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right-panel">
                <div className="auth-right-card">
                    <div className="auth-card-logo">
                        <HyperblogLogo className="w-[140px]" />
                    </div>

                    <div className="auth-card-header">
                        <h2 className="auth-card-title">Verify your email</h2>
                        <p className="auth-card-subtitle">
                            Code sent to <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{maskedEmail}</strong>{' '}
                            <span className="auth-wrong-email" onClick={handleWrongEmail}>
                                Wrong email?
                            </span>
                        </p>
                    </div>

                    {/* OTP Boxes */}
                    <div className="auth-otp-section">
                        <label className="auth-input-label">Enter 6-digit code</label>
                        <div
                            className={`auth-otp-boxes${shake ? ' auth-otp-shake' : ''}${isInvalidOTP ? ' auth-otp-error' : ''}`}
                            onPaste={handlePaste}
                        >
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => { inputRefs.current[i] = el; }}
                                    id={`otp-digit-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleDigitChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className={`auth-otp-box${digit ? ' auth-otp-box-filled' : ''}${isInvalidOTP ? ' auth-otp-box-error' : ''}`}
                                    autoComplete="one-time-code"
                                    aria-label={`OTP digit ${i + 1}`}
                                />
                            ))}
                        </div>
                        {isInvalidOTP && (
                            <p className="auth-otp-error-msg">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="6" stroke="#FF4444" strokeWidth="1.2" />
                                    <path d="M7 4v3M7 9.5v.5" stroke="#FF4444" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                Invalid code. Please try again.
                            </p>
                        )}
                    </div>

                    {/* Timer & Resend */}
                    <div className="auth-resend-row">
                        <OtpTimer setHeadTimer={setTimer} headTimer={timer} />
                        <button
                            className="auth-resend-btn"
                            onClick={hanldeResendOtp}
                            disabled={timer > 0 || isResending}
                            id="otp-resend-btn"
                        >
                            {isResending ? (
                                <span className="auth-cta-spinner" />
                            ) : (
                                'Resend code'
                            )}
                        </button>
                    </div>

                    {/* Verify */}
                    <button
                        className="auth-cta-btn"
                        onClick={handleVerifyOTP}
                        disabled={otp.length < OTP_LENGTH || isVerifying}
                        id="otp-verify-btn"
                    >
                        {isVerifying ? (
                            <span className="auth-cta-spinner" />
                        ) : (
                            <>
                                Verify & Continue
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="auth-terms">
                        Didn&apos;t get the code? Check your spam folder.
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

                /* ─── LEFT PANEL (same as Login) ─── */
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
                    width: 500px; height: 500px;
                    top: -150px; left: -150px;
                    background: radial-gradient(circle, rgba(255, 82, 0, 0.35) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: glowPulse 6s ease-in-out infinite;
                }
                .auth-left-glow-2 {
                    position: absolute;
                    width: 400px; height: 400px;
                    bottom: -120px; right: -80px;
                    background: radial-gradient(circle, rgba(255, 138, 0, 0.25) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: glowPulse 8s ease-in-out infinite reverse;
                }
                @keyframes glowPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                .auth-particles { position: absolute; inset: 0; pointer-events: none; }
                .auth-particle {
                    position: absolute;
                    left: var(--x); bottom: -10px;
                    width: var(--size); height: var(--size);
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
                    position: relative; z-index: 2;
                    display: flex; flex-direction: column; gap: 28px;
                }
                .auth-left-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(255, 82, 0, 0.15);
                    border: 1px solid rgba(255, 82, 0, 0.3);
                    border-radius: 100px; padding: 6px 16px;
                    color: #FF8A40; font-size: 12px; font-weight: 600;
                    letter-spacing: 0.04em; text-transform: uppercase; width: fit-content;
                }
                .auth-badge-dot {
                    width: 6px; height: 6px;
                    background: #FF5200; border-radius: 50%;
                    box-shadow: 0 0 6px #FF5200;
                    animation: dotBlink 2s ease-in-out infinite;
                }
                @keyframes dotBlink {
                    0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
                }
                .auth-left-headline {
                    font-size: 48px; font-weight: 800; line-height: 1.1;
                    color: #ffffff; letter-spacing: -0.02em; margin: 0;
                }
                .auth-left-accent {
                    background: linear-gradient(90deg, #FF5200, #FF8A00);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .auth-left-body {
                    font-size: 15px; line-height: 1.7;
                    color: rgba(255,255,255,0.5); margin: 0; font-weight: 400;
                }
                .auth-otp-illustration {
                    display: flex; align-items: center; gap: 14px;
                    background: rgba(255,82,0,0.07);
                    border: 1px solid rgba(255,82,0,0.15);
                    border-radius: 16px; padding: 16px 20px;
                }
                .auth-otp-shield { flex-shrink: 0; }
                .auth-otp-secure-text { font-size: 13px; color: rgba(255,255,255,0.5); margin: 0; }

                /* ─── RIGHT PANEL ─── */
                .auth-right-panel {
                    flex: 1; display: flex; align-items: center;
                    justify-content: center; padding: 40px 24px; background: #09090f;
                }
                .auth-right-card {
                    width: 100%; max-width: 440px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px; padding: 40px 36px;
                    display: flex; flex-direction: column; gap: 24px;
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
                    font-size: 26px; font-weight: 700; color: #ffffff;
                    margin: 0; letter-spacing: -0.02em;
                }
                .auth-card-subtitle {
                    font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; font-weight: 400;
                }
                .auth-wrong-email {
                    color: rgba(255,82,0,0.8); cursor: pointer;
                    text-decoration: underline; text-underline-offset: 2px; margin-left: 6px;
                    font-weight: 500; transition: color 0.2s;
                }
                .auth-wrong-email:hover { color: #FF5200; }

                /* OTP Boxes */
                .auth-otp-section { display: flex; flex-direction: column; gap: 12px; }
                .auth-input-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); }
                .auth-otp-boxes {
                    display: flex; gap: 10px; justify-content: space-between;
                }
                .auth-otp-boxes.auth-otp-shake {
                    animation: otpShake 0.5s ease;
                }
                @keyframes otpShake {
                    0%, 100% { transform: translateX(0); }
                    10% { transform: translateX(-6px); }
                    30% { transform: translateX(6px); }
                    50% { transform: translateX(-4px); }
                    70% { transform: translateX(4px); }
                    90% { transform: translateX(-2px); }
                }
                .auth-otp-box {
                    width: 52px; height: 58px;
                    background: rgba(255,255,255,0.04);
                    border: 1.5px solid rgba(255,255,255,0.1);
                    border-radius: 14px;
                    text-align: center;
                    font-size: 22px; font-weight: 700; color: #ffffff;
                    outline: none;
                    transition: all 0.15s ease;
                    caret-color: #FF5200;
                    font-family: inherit;
                    letter-spacing: 0;
                }
                .auth-otp-box:focus {
                    border-color: rgba(255,82,0,0.7);
                    box-shadow: 0 0 0 3px rgba(255,82,0,0.12), 0 2px 12px rgba(255,82,0,0.15);
                    background: rgba(255,82,0,0.04);
                    transform: translateY(-1px);
                }
                .auth-otp-box-filled {
                    border-color: rgba(255,82,0,0.5);
                    background: rgba(255,82,0,0.07);
                    animation: boxPop 0.15s ease;
                }
                @keyframes boxPop {
                    0% { transform: scale(0.9); }
                    60% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .auth-otp-box-error {
                    border-color: rgba(255, 68, 68, 0.6) !important;
                    background: rgba(255, 68, 68, 0.06) !important;
                }
                .auth-otp-error-msg {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: #FF6666; margin: 0;
                }

                .auth-resend-row {
                    display: flex; align-items: center; justify-content: space-between;
                }
                .auth-resend-btn {
                    background: none; border: none; cursor: pointer;
                    font-size: 13px; font-weight: 500;
                    color: rgba(255,82,0,0.75); text-decoration: underline;
                    text-underline-offset: 2px; padding: 0;
                    transition: color 0.2s; display: flex; align-items: center;
                    font-family: inherit;
                }
                .auth-resend-btn:hover:not(:disabled) { color: #FF5200; }
                .auth-resend-btn:disabled { color: rgba(255,255,255,0.2); cursor: not-allowed; text-decoration: none; }

                .auth-cta-btn {
                    width: 100%; height: 50px;
                    background: linear-gradient(135deg, #FF5200, #FF7A00);
                    border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 600; color: white;
                    cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px;
                    transition: all 0.2s ease; position: relative; overflow: hidden;
                    letter-spacing: 0.01em;
                    box-shadow: 0 4px 20px rgba(255, 82, 0, 0.35);
                    font-family: inherit;
                }
                .auth-cta-btn::before {
                    content: ''; position: absolute;
                    top: 0; left: -100%; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transition: left 0.5s ease;
                }
                .auth-cta-btn:hover:not(:disabled)::before { left: 100%; }
                .auth-cta-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 30px rgba(255, 82, 0, 0.45);
                }
                .auth-cta-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
                .auth-cta-spinner {
                    width: 18px; height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white; border-radius: 50%;
                    animation: spin 0.7s linear infinite; display: inline-block;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .auth-terms {
                    font-size: 12px; color: rgba(255,255,255,0.25);
                    text-align: center; margin: 0; line-height: 1.5;
                }

                @media (max-width: 768px) {
                    .auth-split-root { flex-direction: column; }
                    .auth-left-panel { width: 100%; min-height: 160px; padding: 32px 24px; }
                    .auth-left-headline { font-size: 28px; }
                    .auth-left-body { display: none; }
                    .auth-otp-illustration { display: none; }
                    .auth-right-panel { padding: 28px 16px; }
                    .auth-right-card { padding: 24px 20px; border-radius: 20px; }
                    .auth-otp-box { width: 44px; height: 50px; font-size: 18px; }
                }
            `}</style>
        </div>
    );
};

export default OtpContent;
