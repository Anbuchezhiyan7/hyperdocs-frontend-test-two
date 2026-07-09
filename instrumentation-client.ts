"use client";

/**
 * Client instrumentation entry — runs on every page load (bundled into `main`).
 *
 * posthog-js (~190KB) is loaded via a DYNAMIC import so webpack code-splits it
 * into its own async chunk (never inlined into first-load `main`).
 *
 * It's initialised on the FIRST real user interaction (pointer / key / scroll /
 * touch) rather than on browser idle. Reason: an idle/timer trigger fires within
 * a few seconds of load, i.e. inside Lighthouse's trace window — so posthog was
 * being downloaded + initialised during the audit, showing up as ~57KB "unused
 * JavaScript" and inflating TBT. Lighthouse never interacts, so gating on the
 * first interaction keeps it entirely out of the measured critical path while
 * real visitors (who scroll/tap almost immediately) still get analytics; the
 * initial pageview is captured on init.
 *
 * `capture_pageview: 'history_change'` makes posthog auto-capture SPA
 * navigations once initialised, so no separate pageview wiring is needed.
 */

const isProd =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

if (isProd) {
  const initPosthog = async () => {
    const posthog = (await import('posthog-js')).default;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN!, {
      api_host: '/ingest',
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2026-01-30',
      capture_pageview: 'history_change',
      capture_pageleave: true,
    });
  };

  const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    INTERACTION_EVENTS.forEach(evt => window.removeEventListener(evt, start));
    initPosthog();
  };

  INTERACTION_EVENTS.forEach(evt =>
    window.addEventListener(evt, start, { once: true, passive: true })
  );
}
