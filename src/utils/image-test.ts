import { ensureWhatsAppCompatibleImage } from './metadata';

/**
 * Test image URLs for WhatsApp compatibility
 */
export function testImageCompatibility(imageUrls: string[]): void {
    console.log('=== WhatsApp Image Compatibility Test ===');
    
    imageUrls.forEach((url, index) => {
        console.log(`\nTest ${index + 1}:`);
        console.log('Original URL:', url);
        
        try {
            const convertedUrl = ensureWhatsAppCompatibleImage(url);
            console.log('Converted URL:', convertedUrl);
            console.log('Conversion successful:', convertedUrl !== url);
        } catch (error) {
            console.error('Error processing URL:', error);
        }
    });
    
    console.log('\n=== Test Complete ===');
}

/**
 * Validate Cloudinary image URL format
 */
export function validateImageUrl(imageUrl: string): {
    isValid: boolean;
    format: string;
    isHttps: boolean;
    isCloudinary: boolean;
    issues: string[];
} {
    const issues: string[] = [];
    let format = 'unknown';
    let isHttps = false;
    let isCloudinary = false;
    
    try {
        const url = new URL(imageUrl);
        isHttps = url.protocol === 'https:';
        isCloudinary = imageUrl.includes('cloudinary.com');
        
        const pathname = url.pathname.toLowerCase();
        if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
            format = 'jpeg';
        } else if (pathname.endsWith('.png')) {
            format = 'png';
        } else if (pathname.endsWith('.webp')) {
            format = 'webp';
        } else {
            format = 'unknown';
            if (isCloudinary) {
                issues.push('Unknown Cloudinary image format');
            }
        }
        
        if (!isHttps) {
            issues.push('URL should use HTTPS for better compatibility');
        }
        
        if (!isCloudinary) {
            issues.push('Non-Cloudinary URL detected');
        }
        
    } catch (error) {
        issues.push('Invalid URL format');
    }
    
    return {
        isValid: issues.length === 0,
        format,
        isHttps,
        isCloudinary,
        issues
    };
}

/**
 * Generate WhatsApp debug URL
 */
export function generateWhatsAppDebugUrl(pageUrl: string): string {
    return `https://developers.facebook.com/tools/debug/sharing/?q=${encodeURIComponent(pageUrl)}`;
}

/**
 * Generate WhatsApp share URL
 */
export function generateWhatsAppShareUrl(pageUrl: string, text?: string): string {
    const shareText = text ? `${text} ${pageUrl}` : pageUrl;
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
}

/**
 * Test Cloudinary image conversion for WhatsApp
 */
export function testCloudinaryConversion(cloudinaryUrls: string[]): void {
    console.log('=== Cloudinary WhatsApp Conversion Test ===');
    
    cloudinaryUrls.forEach((url, index) => {
        console.log(`\nTest ${index + 1}:`);
        console.log('Original Cloudinary URL:', url);
        
        const validation = validateImageUrl(url);
        console.log('Validation:', validation);
        
        try {
            const convertedUrl = ensureWhatsAppCompatibleImage(url);
            console.log('Converted URL:', convertedUrl);
            console.log('Conversion successful:', convertedUrl !== url);
            
            if (convertedUrl !== url) {
                console.log('Cloudinary parameters added:', {
                    format: 'f_jpg (JPEG format)',
                    quality: 'q_85 (85% quality)',
                    size: 'w_1200,h_630 (optimal WhatsApp size)',
                    crop: 'c_fill (fill crop mode)'
                });
            }
        } catch (error) {
            console.error('Error processing Cloudinary URL:', error);
        }
    });
    
    console.log('\n=== Test Complete ===');
} 