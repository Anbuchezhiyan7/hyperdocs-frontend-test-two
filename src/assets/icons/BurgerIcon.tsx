import { HTMLAttributes } from 'react';

export default function BurgerIcon(props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            width="16"
            height="12"
            viewBox="0 0 16 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M15 5H1C0.447719 5 0 5.44772 0 6C0 6.55228 0.447719 7 1 7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5Z"
                fill="#5D5D5D"
            />
            <path
                d="M1 2.3335H15C15.5523 2.3335 16 1.88578 16 1.3335C16 0.781215 15.5523 0.333496 15 0.333496H1C0.447719 0.333496 0 0.781215 0 1.3335C0 1.88578 0.447719 2.3335 1 2.3335Z"
                fill="#5D5D5D"
            />
            <path
                d="M15 9.66699H1C0.447719 9.66699 0 10.1147 0 10.667C0 11.2193 0.447719 11.667 1 11.667H15C15.5523 11.667 16 11.2193 16 10.667C16 10.1147 15.5523 9.66699 15 9.66699Z"
                fill="#5D5D5D"
            />
        </svg>
    );
}
