'use client';

import { apiConnectdomain, apiUpdateSetting } from '@/api/settings';
import { HyperblogLogo } from '@/assets/icons';
import { DOMAIN_URL } from '@/constants/definitions';
import { useAppStore } from '@/store/useAppStore';
import { getLocalUTC } from '@/utils/time';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Urls from '../settings/tabs/Domain/Urls';
import { getCookie } from '@/utils/cookie';

// Utility function to convert site name to URL-friendly format — defined outside
// component so it's stable. Kept here for co-location with SiteDetails logic.

const SiteDetailsContent = () => {
    const router = useRouter();
    const { user, setUserData } = useAppStore();
    const [siteDetails, setSiteDetails] = useState({ site_name: '', site_address: '' });
    const [error, setError] = useState('');
    const username = getCookie('username');
    const [isVerifying, setIsVerifying] = useState<string | null>(null);
    const [isInvalidUrl, setIsInvalidUrl] = useState(false);
    const [success, setSuccess] = useState(false);

    // Memoised — stable reference avoids re-running on every keystroke render
    const convertToUrlFriendly = useCallback((siteName: string): string => {
        return siteName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }, []);

    const handleVerifySiteDetails = async (isSkip?: boolean) => {
        setIsVerifying(isSkip ? 'skip' : 'continue');
        const timezone = getLocalUTC();
        try {
            // Use Promise.allSettled so a non-critical failure (e.g. SEO settings)
            // never blocks the user from completing onboarding.
            const [settingsResult, , domainResult] = await Promise.allSettled([
                apiUpdateSetting('general', {
                    organization_name: username,
                    time_zone: timezone,
                    accent_color: '#000000',
                    is_new_user: true,
                    show_hyperblog_branding: true,
                    show_description: true,
                    description:
                        'A personal space to share thoughts, ideas, and insights through writing. Explore articles created to inform, express, and inspire.',
                }),
                apiUpdateSetting('seo', {
                    meta_title: 'Blog Articles & Insights | Hyperblog',
                    meta_description:
                        'Explore a collection of blog posts covering ideas, insights, and experiences. Discover articles written to inform, share, and inspire.',
                }),
                apiConnectdomain(
                    {
                        default:
                            siteDetails?.site_address?.toLowerCase().trim().replace(/\s+/g, '') +
                            '.' +
                            DOMAIN_URL,
                        site_name: siteDetails?.site_name,
                    },
                    isSkip
                ),
            ]);

            // Domain is the critical call — bail if it failed
            if (domainResult.status === 'rejected') {
                const err = domainResult.reason;
                if (err?.status === 400) {
                    setIsInvalidUrl(true);
                }
                setError(err?.message || 'Domain is unavailable. Try a different address.');
                return;
            }

            // Non-critical: log but don't block onboarding
            if (settingsResult.status === 'rejected') {
                console.warn('[SiteDetails] General settings update failed (non-critical):', settingsResult.reason);
            }

            const domainData = (domainResult as PromiseFulfilledResult<any>).value;
            setUserData({ ...user, ...domainData.data });

            // Track onboarding completion
            (window as any).posthog?.capture('onboarding_site_created', {
                skipped: !!isSkip,
            });

            // Brief celebration before redirect
            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/blogs', { scroll: false });
            }, 900);
        } catch (err: any) {
            if (err.status === 400) {
                setIsInvalidUrl(true);
                setError(err.message);
            }
        } finally {
            setIsVerifying(null);
        }
    };

    const handleSiteValue = (key: string, value: any) => {
        if (key === 'site_name') {
            if (value) {
                const urlFriendlyName = convertToUrlFriendly(value);
                setSiteDetails(prev => ({
                    ...prev,
                    site_name: value,
                    site_address: urlFriendlyName,
                }));
            } else {
                setSiteDetails(prev => ({ ...prev, site_name: value, site_address: '' }));
            }
        } else if (key === 'site_address') {
            const formattedValue = value.replace(/\s+/g, '-');
            setSiteDetails(prev => ({
                ...prev,
                [key]: formattedValue,
                site_name: formattedValue,
            }));
        } else {
            setSiteDetails(prev => ({ ...prev, [key]: value }));
        }
        if (isInvalidUrl) setIsInvalidUrl(false);
    };

    const disableContinueButton = !siteDetails?.site_name || !siteDetails?.site_address;
    const previewUrl = siteDetails?.site_address
        ? `${siteDetails.site_address}.${DOMAIN_URL || 'hyperblog.cloud'}`
        : null;

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
                        Final Step
                    </div>
                    <h1 className="auth-left-headline">
                        Claim your
                        <br />
                        <span className="auth-left-accent">identity.</span>
                    </h1>
                    <p className="auth-left-body">
                        Your Hyperblog URL is your permanent home on the internet. Pick something memorable.
                    </p>

                    {/* Steps */}
                    <div className="auth-steps">
                        {[
                            { label: 'Sign in', done: true },
                            { label: 'Verify email', done: true },
                            { label: 'Set your address', done: false, active: true },
                        ].map(({ label, done, active }, i) => (
                            <div key={label} className={`auth-step${done ? ' auth-step-done' : ''}${active ? ' auth-step-active' : ''}`}>
                                <div className="auth-step-circle">
                                    {done ? (
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <span>{i + 1}</span>
                                    )}
                                </div>
                                <span className="auth-step-label">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="auth-site-tip">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="rgba(255,138,0,0.6)" strokeWidth="1.2" />
                            <path d="M8 5v4M8 10.5v.5" stroke="#FF8A00" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <span>You can connect a custom domain anytime from settings.</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right-panel">
                <div className={`auth-right-card${success ? ' auth-card-success' : ''}`}>
                    {success ? (
                        <div className="auth-success-state">
                            <div className="auth-success-checkmark">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="19" stroke="#FF5200" strokeWidth="1.5" />
                                    <path d="M12 20l6 6 10-10" stroke="#FF5200" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                        style={{ strokeDasharray: 30, strokeDashoffset: 0, animation: 'checkDraw 0.4s ease forwards' }} />
                                </svg>
                            </div>
                            <h2 className="auth-card-title" style={{ textAlign: 'center' }}>Your blog is live!</h2>
                            <p className="auth-card-subtitle" style={{ textAlign: 'center' }}>
                                Redirecting to your dashboard…
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="auth-card-logo">
                                <HyperblogLogo className="w-[140px]" />
                            </div>

                            <div className="auth-card-header">
                                <h2 className="auth-card-title">Set your blog address</h2>
                                <p className="auth-card-subtitle">
                                    This will be your permanent Hyperblog URL — choose wisely.
                                </p>
                            </div>

                            {/* Domain input */}
                            <div className="auth-site-input-group">
                                <Urls
                                    label="Site Address"
                                    hideAddonBefore={true}
                                    hideConnectButton
                                    value={siteDetails?.site_address || ''}
                                    onChange={value => handleSiteValue('site_address', value?.toLowerCase())}
                                    hideAddonAfter={false}
                                    addonAfter=".hyperblog.cloud"
                                    labelClassName="auth-site-label"
                                    description={null}
                                />
                            </div>

                            {/* Live preview */}
                            {previewUrl && (
                                <div className="auth-preview-card">
                                    <div className="auth-preview-dots">
                                        <span className="auth-preview-dot" style={{ background: '#ff5f57' }} />
                                        <span className="auth-preview-dot" style={{ background: '#febc2e' }} />
                                        <span className="auth-preview-dot" style={{ background: '#28c840' }} />
                                    </div>
                                    <div className="auth-preview-url">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <circle cx="6" cy="6" r="5.3" stroke="rgba(255,82,0,0.5)" strokeWidth="1" />
                                            <path d="M4 6a3.5 3.5 0 003.5 0M2.5 6h7M4 3.5C4 5.2 4.9 6.7 6 7.5c1.1-.8 2-2.3 2-4" stroke="rgba(255,82,0,0.5)" strokeWidth="0.8" strokeLinecap="round" />
                                        </svg>
                                        <span>https://{previewUrl}</span>
                                    </div>
                                </div>
                            )}

                            {isInvalidUrl && (
                                <p className="auth-otp-error-msg">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <circle cx="7" cy="7" r="6" stroke="#FF4444" strokeWidth="1.2" />
                                        <path d="M7 4v3M7 9.5v.5" stroke="#FF4444" strokeWidth="1.2" strokeLinecap="round" />
                                    </svg>
                                    {error || 'This address is already taken. Try another.'}
                                </p>
                            )}

                            <button
                                className="auth-cta-btn"
                                onClick={() => handleVerifySiteDetails()}
                                disabled={disableContinueButton || isVerifying === 'continue'}
                                id="site-details-continue-btn"
                            >
                                {isVerifying === 'continue' ? (
                                    <span className="auth-cta-spinner" />
                                ) : (
                                    <>
                                        Launch my blog
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <p className="auth-terms">
                                This URL can&apos;t be changed later, but you can always connect your own domain.
                            </p>
                        </>
                    )}
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
                .auth-left-panel {
                    position: relative; width: 48%; min-height: 100vh;
                    background: linear-gradient(135deg, #1a0a00 0%, #2d1100 40%, #1a0500 100%);
                    overflow: hidden; display: flex; align-items: center;
                    justify-content: center; padding: 60px 56px;
                }
                .auth-left-glow-1 {
                    position: absolute; width: 500px; height: 500px;
                    top: -150px; left: -150px;
                    background: radial-gradient(circle, rgba(255, 82, 0, 0.35) 0%, transparent 70%);
                    border-radius: 50%; animation: glowPulse 6s ease-in-out infinite;
                }
                .auth-left-glow-2 {
                    position: absolute; width: 400px; height: 400px;
                    bottom: -120px; right: -80px;
                    background: radial-gradient(circle, rgba(255, 138, 0, 0.25) 0%, transparent 70%);
                    border-radius: 50%; animation: glowPulse 8s ease-in-out infinite reverse;
                }
                @keyframes glowPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                .auth-particles { position: absolute; inset: 0; pointer-events: none; }
                .auth-particle {
                    position: absolute; left: var(--x); bottom: -10px;
                    width: var(--size); height: var(--size);
                    background: rgba(255, 120, 30, 0.7); border-radius: 50%;
                    animation: floatUp var(--dur) var(--delay) ease-in infinite;
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 0.8; }
                    80% { opacity: 0.3; }
                    100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
                }
                .auth-left-content {
                    position: relative; z-index: 2;
                    display: flex; flex-direction: column; gap: 24px;
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
                    width: 6px; height: 6px; background: #FF5200; border-radius: 50%;
                    box-shadow: 0 0 6px #FF5200; animation: dotBlink 2s ease-in-out infinite;
                }
                @keyframes dotBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                .auth-left-headline {
                    font-size: 48px; font-weight: 800; line-height: 1.1;
                    color: #ffffff; letter-spacing: -0.02em; margin: 0;
                }
                .auth-left-accent {
                    background: linear-gradient(90deg, #FF5200, #FF8A00);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .auth-left-body {
                    font-size: 15px; line-height: 1.7;
                    color: rgba(255,255,255,0.5); margin: 0;
                }

                /* Steps */
                .auth-steps { display: flex; flex-direction: column; gap: 10px; }
                .auth-step {
                    display: flex; align-items: center; gap: 12px; opacity: 0.4;
                }
                .auth-step-done { opacity: 0.7; }
                .auth-step-active { opacity: 1; }
                .auth-step-circle {
                    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
                    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6);
                }
                .auth-step-done .auth-step-circle {
                    background: rgba(255,82,0,0.2); border-color: rgba(255,82,0,0.4);
                }
                .auth-step-active .auth-step-circle {
                    background: linear-gradient(135deg, #FF5200, #FF7A00);
                    border-color: transparent; color: white;
                    box-shadow: 0 0 12px rgba(255,82,0,0.4);
                }
                .auth-step-label { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.7); }
                .auth-step-active .auth-step-label { color: white; }

                .auth-site-tip {
                    display: flex; align-items: flex-start; gap: 10px;
                    background: rgba(255,138,0,0.06);
                    border: 1px solid rgba(255,138,0,0.15);
                    border-radius: 12px; padding: 12px 14px;
                }
                .auth-site-tip span { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.5; }

                /* RIGHT */
                .auth-right-panel {
                    flex: 1; display: flex; align-items: center;
                    justify-content: center; padding: 40px 24px; background: #09090f;
                }
                .auth-right-card {
                    width: 100%; max-width: 440px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px; padding: 40px 36px;
                    display: flex; flex-direction: column; gap: 22px;
                    animation: cardSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
                    box-shadow: 0 0 60px rgba(255,82,0,0.06), 0 0 120px rgba(0,0,0,0.6);
                    transition: box-shadow 0.3s ease;
                }
                .auth-card-success {
                    box-shadow: 0 0 60px rgba(255,82,0,0.2), 0 0 120px rgba(0,0,0,0.6) !important;
                }
                @keyframes cardSlideIn {
                    from { opacity: 0; transform: translateX(30px) scale(0.98); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }
                .auth-card-logo { display: flex; align-items: center; }
                .auth-card-header { display: flex; flex-direction: column; gap: 6px; }
                .auth-card-title {
                    font-size: 24px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.02em;
                }
                .auth-card-subtitle { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; }

                .auth-site-input-group { display: flex; flex-direction: column; }

                /* Live preview */
                .auth-preview-card {
                    background: rgba(255,82,0,0.05);
                    border: 1px solid rgba(255,82,0,0.15);
                    border-radius: 12px; overflow: hidden;
                    animation: fadeIn 0.25s ease;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                .auth-preview-dots {
                    display: flex; gap: 5px; padding: 8px 12px;
                    background: rgba(255,82,0,0.04);
                    border-bottom: 1px solid rgba(255,82,0,0.1);
                }
                .auth-preview-dot { width: 8px; height: 8px; border-radius: 50%; }
                .auth-preview-url {
                    padding: 10px 14px; display: flex; align-items: center; gap: 8px;
                    font-size: 13px; color: rgba(255,82,0,0.8); font-family: 'Monaco', monospace;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }

                .auth-otp-error-msg {
                    display: flex; align-items: center; gap: 6px;
                    font-size: 12px; color: #FF6666; margin: -6px 0;
                }

                .auth-cta-btn {
                    width: 100%; height: 50px;
                    background: linear-gradient(135deg, #FF5200, #FF7A00);
                    border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 600; color: white;
                    cursor: pointer; display: flex; align-items: center;
                    justify-content: center; gap: 8px;
                    transition: all 0.2s ease; position: relative; overflow: hidden;
                    letter-spacing: 0.01em;
                    box-shadow: 0 4px 20px rgba(255,82,0,0.35);
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
                    box-shadow: 0 8px 30px rgba(255,82,0,0.45);
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
                    font-size: 12px; color: rgba(255,255,255,0.2);
                    text-align: center; margin: 0; line-height: 1.5;
                }

                /* Success state */
                .auth-success-state {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 16px; padding: 20px 0;
                }
                .auth-success-checkmark {
                    animation: popIn 0.4s cubic-bezier(0.22,1,0.36,1);
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes checkDraw {
                    from { stroke-dashoffset: 30; }
                    to { stroke-dashoffset: 0; }
                }

                @media (max-width: 768px) {
                    .auth-split-root { flex-direction: column; }
                    .auth-left-panel { width: 100%; min-height: 160px; padding: 32px 24px; }
                    .auth-left-headline { font-size: 28px; }
                    .auth-left-body { display: none; }
                    .auth-steps { display: none; }
                    .auth-site-tip { display: none; }
                    .auth-right-panel { padding: 28px 16px; }
                    .auth-right-card { padding: 24px 20px; border-radius: 20px; }
                }
            `}</style>
        </div>
    );
};

export default SiteDetailsContent;
