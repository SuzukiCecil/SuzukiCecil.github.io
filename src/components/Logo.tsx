/** 湯のみとサイコロ：一服しながら一局 */
export function Logo({ className = 'h-12 w-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`shrink-0 drop-shadow-sm ${className}`}>
      <rect x="2" y="6" width="44" height="38" rx="10" fill="var(--wood)" />
      <rect x="2" y="6" width="44" height="32" rx="10" fill="#14503c" />
      <path d="M14 14c-2 2 2 3 0 5M19 13c-2 2 2 3 0 5" stroke="#fffaf2" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M8 21h17l-1.6 11.5a3 3 0 0 1-3 2.5h-7.8a3 3 0 0 1-3-2.5z" fill="#fffaf2" />
      <ellipse cx="16.5" cy="21" rx="8.5" ry="2" fill="#9cba5b" />
      <rect x="10" y="26" width="13" height="2" rx="1" fill="#e8743b" opacity="0.85" />
      <g transform="rotate(12 34 27)">
        <rect x="27" y="20" width="14" height="14" rx="3.5" fill="#e8743b" />
        <circle cx="31" cy="24" r="1.6" fill="#fff" />
        <circle cx="34" cy="27" r="1.6" fill="#fff" />
        <circle cx="37" cy="30" r="1.6" fill="#fff" />
      </g>
    </svg>
  )
}
