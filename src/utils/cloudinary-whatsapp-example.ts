import { testCloudinaryConversion, validateImageUrl, generateWhatsAppDebugUrl } from './image-test';

/**
 * Example usage of Cloudinary WhatsApp conversion
 */

// Example Cloudinary URLs (replace with your actual URLs)
const exampleCloudinaryUrls = [
    'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.png',
    'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.webp',
    'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg',
    'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.png?w=800&h=600'
];

// Test the conversion
export function runCloudinaryWhatsAppTest() {
    console.log('Testing Cloudinary WhatsApp conversion...');
    testCloudinaryConversion(exampleCloudinaryUrls);
}

// Validate individual URLs
export function validateCloudinaryUrl(url: string) {
    const result = validateImageUrl(url);
    console.log('URL Validation Result:', result);
    return result;
}

// Generate WhatsApp debug URL for testing
export function getWhatsAppDebugUrl(pageUrl: string) {
    const debugUrl = generateWhatsAppDebugUrl(pageUrl);
    console.log('WhatsApp Debug URL:', debugUrl);
    return debugUrl;
}

// Example of how the conversion works:
/*
Original PNG: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.png
Converted:   https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.png?f_jpg,q_85,w_1200,h_630,c_fill

Cloudinary Parameters Added:
- f_jpg: Convert to JPEG format
- q_85: Set quality to 85%
- w_1200,h_630: Resize to optimal WhatsApp size
- c_fill: Crop to fill the dimensions
*/ 