import { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
    token: {
        // Primary Colors
        colorPrimary: '#FF5200',
        colorPrimaryHover: '#E54A00',
        colorPrimaryActive: '#FF5200',
        colorSuccess: '#28A745',

        // Background Colors
        colorBgContainer: '#FAFAFA',
        colorBgBase: '#FFFFFF',
        colorBgLayout: '#F3F3F3',
        colorBorder: '#E0E0E0',

        // Text Colors
        colorText: '#1A1A1A',
        colorTextSecondary: '#6C757D',
        colorTextTertiary: '#6C757D',
        colorTextQuaternary: '#6C757D',

        // Status Colors
        colorWarning: '#FFC107',
        colorError: '#DC3545',

        // Border Radius
        borderRadius: 6,

        // Font
        fontFamily:
            "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
        Button: {
            borderRadius: 10,
            controlHeight: 40,
            paddingContentHorizontal: 16,
        },
        Input: {
            borderRadius: 10,
            controlHeight: 40,
        },
        Select: {
            borderRadius: 10,
            controlHeight: 40,
        },
    },
};
