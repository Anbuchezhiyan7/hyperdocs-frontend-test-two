import * as React from "react";

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      fill="#FFC107"
      d="m23.64 18.1-9.4-15.82C13.77 1.48 12.94 1 12 1s-1.77.48-2.23 1.28L.36 18.1c-.47.82-.47 1.79 0 2.6S1.67 22 2.6 22h18.81c.94 0 1.78-.49 2.24-1.3s.46-1.78-.01-2.6M13 18h-2v-2h2zm0-4h-2V8h2z"
    ></path>
  </svg>
);

export default WarningIcon;
