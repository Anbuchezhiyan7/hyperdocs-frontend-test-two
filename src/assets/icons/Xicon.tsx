import { HTMLAttributes } from 'react';

export default function Xicon(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_585_19850)">
                <path
                    d="M11.8617 8.46875L19.147 0H17.4205L11.0948 7.35312L6.04234 0H0.214844L7.85516 11.1194L0.214844 20H1.94141L8.62172 12.2348L13.9573 20H19.7848L11.8612 8.46875H11.8617ZM9.49703 11.2172L8.72281 10.11L2.56344 1.29969H5.21531L10.1858 8.41L10.9598 9.51719L17.4212 18.7594H14.7697L9.49703 11.2177V11.2172Z"
                    fill="#3A3B3B"
                />
            </g>
            <defs>
                <clipPath id="clip0_585_19850">
                    <rect width="20" height="20" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
