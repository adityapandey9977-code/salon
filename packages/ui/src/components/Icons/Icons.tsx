import type React from 'react';
import { cn } from '../../utils';

type IconProps = React.SVGProps<SVGSVGElement>;

const BaseSvg = ({ className, children, ...props }: IconProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('w-[18px] h-[18px]', className)}
    {...props}
  >
    {children}
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.4" />
  </BaseSvg>
);

export const OverviewIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </BaseSvg>
);

export const CalendarIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <rect x="3" y="5" width="18" height="16" rx="1" />
    <path d="M7 3v4M17 3v4M3 10h18" />
  </BaseSvg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M4 12h14M14 6l6 6-6 6" />
  </BaseSvg>
);

export const UsersIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21c.5-4 3-6 6-6s5.5 2 6 6M16 11c2.3.2 4 1.7 5 4" />
  </BaseSvg>
);

export const ScissorsIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
  </BaseSvg>
);

export const TeamIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M7 21v-2a5 5 0 0 1 10 0v2M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </BaseSvg>
);

export const BoxIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M4 7h16v14H4zM8 7V4h8v3M4 12h16" />
  </BaseSvg>
);

export const CreditCardIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 10h18M7 15h3" />
  </BaseSvg>
);

export const ChartIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </BaseSvg>
);

export const SettingsIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
  </BaseSvg>
);

export const SearchIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </BaseSvg>
);

export const BellIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
  </BaseSvg>
);

export const PlusIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M12 5v14M5 12h14" />
  </BaseSvg>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M5 19 19 5M9 5h10v10" />
  </BaseSvg>
);

export const ShieldCheckIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M12 3 4 7v5c0 5 3.4 8.2 8 9 4.6-.8 8-4 8-9V7l-8-4Z" />
    <path d="m9 12 2 2 4-4" />
  </BaseSvg>
);

export const ClockIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="M12 8v4l2.5 2.5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
  </BaseSvg>
);

export const UserIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21c.5-4 3-6 6-6s5.5 2 6 6" />
  </BaseSvg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <BaseSvg {...props}>
    <path d="m6 9 6 6 6-6" />
  </BaseSvg>
);
