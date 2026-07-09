'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasConsented = Cookies.get('cookie-consent');
        if (!hasConsented) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookie-consent', 'true', { expires: 365 });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 md:p-6 z-50'
            >
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                            We use cookies
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                            We use cookies to enhance your browsing experience, serve personalized
                            content, and analyze our traffic. By clicking "Accept All", you consent
                            to our use of cookies.
                        </p>
                    </div>
                    <div className='flex gap-4'>
                        <button
                            onClick={handleAccept}
                            className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieConsent;
