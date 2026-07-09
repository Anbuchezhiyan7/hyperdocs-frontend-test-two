import ColorThief from "color-thief-browser";

export const extractColors = (file: File): Promise<{ primary: string; secondary: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = reader.result as string;

            img.onload = async () => {
                try {
                    const colorThief = new ColorThief();
                    const palette = colorThief.getPalette(img, 5);

                    // Extract primary and secondary colors
                    const [primaryRgb, secondaryRgb] = [palette[0], palette[1]];

                    resolve({
                        primary: `rgb(${primaryRgb.join(",")})`,
                        secondary: `rgb(${secondaryRgb.join(",")})`,
                    });
                } catch (err) {
                    reject(new Error("Failed to extract colors"));
                }
            };

            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
};


export const getContrastTextColor = (hex: string) => {
    if (!hex) return '#000';
    
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
  
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
    else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    return brightness > 125 ? '#000' : '#FFF';
  };
  