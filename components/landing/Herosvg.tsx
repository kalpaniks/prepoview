import { Eye, EyeClosed, EyeOff, Lock } from 'lucide-react';

type Props = { className?: string };

export default function SecurityIllustration({ className }: Props) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 420 240"
        role="img"
        aria-label="Security visualization"
        className="text-foreground/80 h-auto w-full"
      >
        <defs>
          <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity=".18" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".4" />
          </linearGradient>
        </defs>

        {/* Frame */}
        <rect
          x="12"
          y="12"
          width="396"
          height="216"
          rx="16"
          fill="none"
          stroke="currentColor"
          opacity=".08"
        />

        {/* App window card */}
        <rect x="40" y="28" width="340" height="184" rx="14" fill="currentColor" opacity=".04" />
        <rect
          x="40"
          y="28"
          width="340"
          height="184"
          rx="14"
          fill="none"
          stroke="url(#borderGrad)"
          opacity=".8"
        />

        {/* Title bar */}
        <rect
          x="40"
          y="28"
          width="340"
          height="32"
          rx="14"
          fill="none"
          stroke="currentColor"
          opacity=".12"
        />

        <circle
          cx="56"
          cy="44"
          r="4"
          className="fill-current text-red-500 dark:text-red-400"
          opacity=".35"
        />
        <circle
          cx="70"
          cy="44"
          r="4"
          className="fill-current text-amber-500 dark:text-amber-400"
          opacity=".50"
        />
        <circle
          cx="84"
          cy="44"
          r="4"
          className="fill-current text-green-500 dark:text-green-400"
          opacity=".35"
        />
        <text x="104" y="48" fontSize="12" fill="currentColor" opacity=".7">
          Secure Share
        </text>
        {/* <EyeOff className="h-4 w-4" /> */}
        {/* Disabled download icon in title bar (arrow + slash) */}
        <g transform="translate(352,36)" opacity=".7">
          <path
            d="M7 0 v11 m0 0 l-3 -3 m3 3 l3 -3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="-2"
            y1="-2"
            x2="14"
            y2="14"
            stroke="currentColor"
            strokeWidth="1"
            opacity=".7"
          />
        </g>

        {/* Subtle lock watermark */}
        <g transform="translate(196,96)" opacity=".06">
          <rect x="-16" y="-8" width="40" height="30" rx="6" fill="currentColor" />
          <rect x="-6" y="-16" width="20" height="14" rx="7" fill="currentColor" />
        </g>

        {/* Code lines */}
        <g transform="translate(56,76)" stroke="currentColor" strokeWidth="2" opacity=".45">
          <line x1="0" y1="0" x2="210" y2="0" />
          <line x1="0" y1="14" x2="250" y2="14" opacity=".7" />
          <line x1="0" y1="28" x2="180" y2="28" opacity=".6" />
          <line x1="0" y1="42" x2="230" y2="42" opacity=".7" />
          <line x1="0" y1="56" x2="200" y2="56" opacity=".55" />
          <line x1="0" y1="70" x2="150" y2="70" opacity=".5" />
        </g>

        {/* Right rail callouts */}
        {/* <g transform="translate(320,76)">
          <rect
            x="0"
            y="0"
            width="54"
            height="14"
            rx="7"
            fill="none"
            stroke="currentColor"
            opacity=".35"
          />
          <text x="7" y="10" fontSize="9" fill="currentColor" opacity=".85">
            Read‑only
          </text>

          <rect
            x="0"
            y="22"
            width="40"
            height="14"
            rx="7"
            fill="none"
            stroke="currentColor"
            opacity=".35"
          />
          <text x="7" y="32" fontSize="9" fill="currentColor" opacity=".85">
            No zip
          </text>
        </g> */}

        <g>
          <rect
            x="56"
            y="176"
            width="108"
            height="24"
            rx="8"
            fill="none"
            stroke="currentColor"
            opacity=".45"
          />
          <text
            x="110"
            y="189"
            fontSize="11"
            fill="currentColor"
            opacity=".9"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Expires in 24h
          </text>

          <rect
            x="174"
            y="176"
            width="108"
            height="24"
            rx="8"
            fill="none"
            stroke="currentColor"
            opacity=".45"
          />
          <text
            x="224"
            y="189"
            fontSize="11"
            fill="currentColor"
            opacity=".9"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            View limit: 3
          </text>

          <rect
            x="292"
            y="176"
            width="70"
            height="24"
            rx="8"
            fill="none"
            stroke="currentColor"
            opacity=".45"
          />
          <text
            x="328"
            y="189"
            fontSize="11"
            fill="currentColor"
            opacity=".9"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            No DL
          </text>
        </g>
      </svg>
    </div>
  );
}
