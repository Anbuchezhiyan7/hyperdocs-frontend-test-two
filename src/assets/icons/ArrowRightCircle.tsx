import * as React from "react";

const ArrowRightCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <g clipPath="url(#clip0_2541_5266)">
      <path
        fill="#333"
        d="M0 8a8 8 0 1 0 8-8 8.01 8.01 0 0 0-8 8m10.667 0c0 .488-.178.96-.502 1.325a15 15 0 0 1-.518.56L7.765 11.8a.666.666 0 1 1-.951-.933L8.7 8.947c.125-.126.294-.312.467-.506a.67.67 0 0 0 0-.882c-.172-.194-.342-.38-.462-.502L6.814 5.133a.666.666 0 1 1 .95-.933l1.887 1.92c.133.133.32.337.512.555.325.365.504.836.504 1.325"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_2541_5266">
        <path fill="#fff" d="M0 0h16v16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default ArrowRightCircle;
