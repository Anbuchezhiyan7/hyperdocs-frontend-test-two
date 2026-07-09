import * as React from "react";

const EditIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width || "32"}
        height={props.height || "32"}
        fill="none"
        viewBox="0 0 32 32"
        className={props.className || ''}
        onClick={props?.onClick}
    >
        <rect
            width="30.5"
            height="30.5"
            x="0.75"
            y="0.75"
            fill="#fff"
            rx="9.25"
        ></rect>
        <rect
            width="30.5"
            height="30.5"
            x="0.75"
            y="0.75"
            stroke="#E0E0E0"
            strokeWidth="1.5"
            rx="9.25"
        ></rect>
        <g clipPath="url(#clip0_1370_13166)">
            <path
                fill="#333"
                d="M11.52 20.788c.14 0 .167-.014.293-.042l2.52-.504a1.6 1.6 0 0 0 .742-.406l6.104-6.104c.938-.938.938-2.548 0-3.486l-.518-.546c-.938-.938-2.562-.938-3.5 0l-6.104 6.118a1.7 1.7 0 0 0-.406.742l-.532 2.548c-.07.476.07.938.406 1.274.266.266.658.406.994.406m.475-3.962 6.104-6.118c.406-.406 1.148-.406 1.54 0l.532.532c.476.476.476 1.148 0 1.61l-6.09 6.118-2.59.434zm9.128 4.83H10.791c-.406 0-.672.266-.672.672s.336.672.672.672h10.276c.406 0 .742-.266.742-.672a.69.69 0 0 0-.686-.672"
            ></path>
        </g>
        <defs>
            <clipPath id="clip0_1370_13166">
                <path fill="#fff" d="M9 9h14v14H9z"></path>
            </clipPath>
        </defs>
    </svg>
);

export default EditIcon;