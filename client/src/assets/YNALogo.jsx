export const YNALogo = ({ size = "medium" }) => {
  const sizes = {
    small: { width: 160, height: 50 },
    medium: { width: 280, height: 90 },
    large: { width: 320, height: 100 }
  };

  return (
    <svg
      width={sizes[size].width}
      height={sizes[size].height}
      viewBox="0 0 320 100"
    >
      <circle cx="50" cy="50" r="42" fill="#22c55e" />
      <g transform="translate(28, 33)">
        <path d="M 5 5 L 10 5 L 14 28 L 38 28 L 35 13 L 12 13"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none" />
        <circle cx="19" cy="34" r="3" fill="white" />
        <circle cx="33" cy="34" r="3" fill="white" />
      </g>
      <text x="110" y="62"
        fontFamily="Arial Black, sans-serif"
        fontSize="52"
        fontWeight="900"
        fill="#22c55e">
        YNA
      </text>
      <text x="115" y="80"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill="#ff6b35"
        letterSpacing="2.5">
        GROCERY
      </text>
    </svg>
  );
};