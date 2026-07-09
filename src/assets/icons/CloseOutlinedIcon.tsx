import * as React from "react";

const CloseOutlinedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
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
      fill="#333"
      d="M20.448 11.55a.74.74 0 0 0-1.048 0l-3.401 3.401-3.401-3.4a.742.742 0 0 0-1.049 1.048l3.401 3.4-3.4 3.402a.741.741 0 1 0 1.048 1.048l3.4-3.4 3.402 3.4a.742.742 0 0 0 1.048-1.048L17.048 16l3.4-3.401a.74.74 0 0 0 0-1.049"
    ></path>
  </svg>
);

export default CloseOutlinedIcon;
