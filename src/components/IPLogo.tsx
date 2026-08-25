export default function IPLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <polygon points="100,20 100,190 26,148 26,62" fill="#22b58a" />
      <polygon points="100,20 100,190 174,148 174,62" fill="#157a5c" />
      <text
        x="100"
        y="140"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="88"
        fill="#f6c945"
      >
        IP
      </text>
    </svg>
  );
}
