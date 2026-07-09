export const getLogoDimensions = (aspectRatio: string | undefined) => {
        // Handle only the two aspect ratios you have
        if (aspectRatio === '16:9') {
            return { width: 96, height: 54 }; // 16:9 ratio (slightly larger for footer)
        } else if (aspectRatio === '1:1') {
            return { width: 50, height: 50 }; // Square ratio
        }
        
        // Default fallback
        return { width: 96, height: 54 };
    };
