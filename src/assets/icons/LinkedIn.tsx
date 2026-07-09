import { HTMLAttributes } from 'react';

export default function LinkedIn(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_585_19783)">
                <path d="M3.2207 3.47461H16.6954V16.8643H3.2207V3.47461Z" fill="white" />
                <path
                    d="M4 16V7.62H6.56V16H4ZM6.64 5.3C6.66 6.02 6.12 6.6 5.26 6.6C4.46 6.6 3.94 6.02 3.94 5.3C3.94 4.56 4.48 4 5.3 4C6.12 4 6.64 4.56 6.64 5.3ZM13.36 16V11.36C13.36 10.28 13 9.54 12.06 9.54C11.36 9.54 10.94 10.04 10.74 10.52C10.68 10.7 10.66 10.94 10.66 11.18V16H8.1V10.3C8.1 9.26 8.06 8.38 8.04 7.62H10.26L10.38 8.8H10.42C10.76 8.24 11.6 7.44 12.98 7.44C14.66 7.44 15.94 8.58 15.94 11.06V16H13.36ZM20 1.76C20 0.8 19.2 0 18.24 0H1.76C0.8 0 0 0.8 0 1.76V18.24C0 19.2 0.8 20 1.76 20H18.24C19.2 20 20 19.2 20 18.24V1.76Z"
                    fill="#1D87BD"
                />
            </g>
            <defs>
                <clipPath id="clip0_585_19783">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
