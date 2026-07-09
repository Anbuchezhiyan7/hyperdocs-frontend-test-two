import { HTMLAttributes } from 'react';
export default function TickIcon(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g clipPath="url(#clip0_843_8737)">
                <path
                    d="M7 0C3.14008 0 0 3.14008 0 7C0 10.8599 3.14008 14 7 14C10.8599 14 14 10.8599 14 7C14 3.14008 10.8599 0 7 0ZM6.94692 8.99442C6.72117 9.22017 6.42425 9.33275 6.12617 9.33275C5.82808 9.33275 5.52825 9.219 5.30017 8.9915L3.67733 7.41883L4.48992 6.58058L6.11917 8.15967L9.50775 4.83408L10.3267 5.66533L6.94692 8.99442Z"
                    fill="#28A745"
                />
            </g>
            <defs>
                <clipPath id="clip0_843_8737">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
