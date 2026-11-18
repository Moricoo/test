import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...props,
  }
}

export function PlayGlyph({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M8.6 5.55c0-1.07 1.17-1.73 2.08-1.17l9.06 5.6a1.53 1.53 0 0 1 0 2.6l-9.06 5.6c-.91.57-2.08-.09-2.08-1.16V5.55Z" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  )
}

export function TodayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
      <circle cx="12" cy="12" r="4.1" />
    </svg>
  )
}

export function GamesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.4 7.6h9.2c2.6 0 4.4 2.4 3.9 4.9l-.8 4.1c-.3 1.7-2.4 2.3-3.6 1l-1.4-1.5a2 2 0 0 0-1.4-.6h-2.6c-.5 0-1 .2-1.4.6L8 17.6c-1.2 1.3-3.3.7-3.6-1l-.8-4.1C3.1 10 4.9 7.6 7.4 7.6Z" />
      <path d="M8 11v3M6.5 12.5h3M15.5 11.6h.01M17.6 13.2h.01" />
    </svg>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 19.5V13M12 19.5V7.5M19 19.5V10" />
      <path d="M3.5 19.5h17" />
      <path d="m4 8 5.4-3.2 4.4 2.4L20 3.5" opacity=".45" />
    </svg>
  )
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.5a4.1 4.1 0 0 1 7.5 3.1C19.5 15.4 12 20 12 20Z" />
    </svg>
  )
}

export function StarIcon({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={props.size ?? 16}
      height={props.size ?? 16}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="m12 3.4 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.4Z" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  )
}

export function UndoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 6.5 4 10.5l4 4" />
      <path d="M4.5 10.5h9.2a5.3 5.3 0 1 1 0 10.6H9" />
    </svg>
  )
}

export function RestartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.8 4.5v4.3h-4.3" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" stroke="none" />
      <rect x="13.6" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 4.6 4.5L19.5 6.5" />
    </svg>
  )
}

export function BrainIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.3a3.1 3.1 0 0 0-5.6 1.2 3.2 3.2 0 0 0-2.1 4.9A3.4 3.4 0 0 0 6.6 18c.3 1.2 1.5 2 2.8 1.8.9-.1 1.7-.7 1.9-1.5V6.3Z" />
      <path d="M12 6.3a3.1 3.1 0 0 1 5.6 1.2 3.2 3.2 0 0 1 2.1 4.9A3.4 3.4 0 0 1 17.4 18c-.3 1.2-1.5 2-2.8 1.8-.9-.1-1.7-.7-1.9-1.5V6.3Z" />
      <path d="M9.3 9.3h-2M9.3 13H8M14.7 9.3h2M14.7 13H16" opacity=".5" />
    </svg>
  )
}

export function JoystickIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="6.4" r="2.6" />
      <path d="M12 9v4.4M7.2 20.5h9.6" />
      <path d="M7.2 14.7c-1.3 0-2.4 1-2.6 2.3l-.2 1.7h15.2l-.2-1.7a2.6 2.6 0 0 0-2.6-2.3H7.2Z" />
    </svg>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5Z" />
      <path d="M18.2 15.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z" />
    </svg>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13.4 3.5 5.5 13.8h5.3l-.7 6.7 8.4-10.6h-5.4l.3-6.4Z" />
    </svg>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 4.5h8v4.2a4 4 0 0 1-8 0V4.5Z" />
      <path d="M8 5.5H5.5v2a3 3 0 0 0 3 3M16 5.5h2.5v2a3 3 0 0 1-3 3" />
      <path d="M12 12.7v3.8M8.5 20h7M10 20v-1.5c0-1 .7-2 2-2s2 1 2 2V20" />
    </svg>
  )
}

export function CategoryIcon({
  icon,
  size = 26,
}: {
  icon: 'brain' | 'joystick' | 'spark' | 'bolt'
  size?: number
}) {
  switch (icon) {
    case 'brain':
      return <BrainIcon size={size} />
    case 'joystick':
      return <JoystickIcon size={size} />
    case 'spark':
      return <SparkIcon size={size} />
    case 'bolt':
      return <BoltIcon size={size} />
  }
}

export function AppleLikeMark({ size = 20 }: { size?: number }) {
  // A simple original storefront glyph: a rounded tile with a play notch.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="currentColor" opacity=".14" />
      <path
        d="M9.2 7.4c0-.7.77-1.14 1.37-.77l5.92 3.66a.9.9 0 0 1 0 1.53l-5.92 3.66c-.6.37-1.37-.07-1.37-.77V7.4Z"
        fill="currentColor"
      />
    </svg>
  )
}
