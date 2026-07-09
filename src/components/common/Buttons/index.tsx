import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

type ButtonProps = AntButtonProps & {
    title?: string;
    onClick?: (e?: any) => void;
};

const Button: React.FC<ButtonProps> = ({ title, children, ...props }) => {
    return (
        <AntButton {...props}>
            {title && title}
            {children}
        </AntButton>
    );
};

export default Button;
