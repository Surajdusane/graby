import { useId } from "react";

export function Illustration({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="267"
      height="268"
      fill="none"
      aria-hidden="true"
    >
      <g filter={`url(#${id}a)`} style={{ mixBlendMode: "plus-lighter" }}>
        <path
          fill="#fff"
          fillOpacity=".48"
          d="M189 76.284 242.642 24 189 83.753v19.691l-8.148-6.11L24 244 176.099 89.864v-13.58H189Z"
        />
      </g>
      <defs>
        <filter
          id={`${id}a`}
          width="266.642"
          height="268"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_809_24" stdDeviation="12" />
        </filter>
      </defs>
    </svg>
  );
}