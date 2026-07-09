import * as React from "react";

const DeleteIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
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
    <path
      fill="#DC3545"
      d="M21.251 11.333h-1.808A2.92 2.92 0 0 0 16.585 9h-1.167a2.92 2.92 0 0 0-2.858 2.333H10.75a.583.583 0 0 0 0 1.167h.584v7.583A2.92 2.92 0 0 0 14.25 23h3.5a2.92 2.92 0 0 0 2.917-2.917V12.5h.583a.583.583 0 0 0 0-1.167m-5.833-1.166h1.167a1.75 1.75 0 0 1 1.65 1.166h-4.467a1.75 1.75 0 0 1 1.65-1.166m4.083 9.916a1.75 1.75 0 0 1-1.75 1.75h-3.5a1.75 1.75 0 0 1-1.75-1.75V12.5h7z"
    ></path>
    <path
      fill="#DC3545"
      d="M14.833 19.5a.583.583 0 0 0 .584-.583v-3.5a.583.583 0 0 0-1.167 0v3.5a.583.583 0 0 0 .583.583M17.165 19.5a.583.583 0 0 0 .584-.583v-3.5a.583.583 0 0 0-1.167 0v3.5a.583.583 0 0 0 .583.583"
    ></path>
  </svg>
);

export default DeleteIcon;