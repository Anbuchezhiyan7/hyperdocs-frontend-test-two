import { HTMLAttributes } from 'react';

export default function GoogleDocsIcon (props: HTMLAttributes<SVGElement>) {
    return (
        <svg
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            {...props}
        >
            <rect width='40' height='40' rx='20' fill='#F3F3F3' />
            <g clip-path='url(#clip0_2069_12176)'>
                <path
                    d='M21.5912 10H13.8632C13.1368 10 12.5 10.636 12.5 11.364V28.6368C12.5 29.364 13.136 30.0008 13.864 30.0008H25.6824C26.4096 30.0008 27.0464 29.3648 27.0464 28.6368V15.4544L23.8648 13.1816L21.5912 10Z'
                    fill='#4285F4'
                />
                <path
                    d='M16.1367 24.5456H23.4095V23.6368H16.1375L16.1367 24.5456ZM16.1367 26.364H21.5911V25.4552H16.1367V26.364ZM16.1367 20V20.9088H23.4095V20H16.1367ZM16.1367 22.7272H23.4095V21.8184H16.1375L16.1367 22.7272Z'
                    fill='#F1F1F1'
                />
                <path
                    d='M21.5898 10V14.0912C21.5898 14.8184 22.2258 15.4544 22.953 15.4544H27.0442L21.5898 10Z'
                    fill='#A1C2FA'
                />
            </g>
            <defs>
                <clipPath id='clip0_2069_12176'>
                    <rect width='14.5456' height='20' fill='white' transform='translate(12.5 10)' />
                </clipPath>
            </defs>
        </svg>
    );
}
