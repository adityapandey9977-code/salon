import React, { useState } from 'react';
import { cn } from '../../utils';

export type AvatarVariant = 'square-monogram' | 'circle-profile' | 'circle-guest';
export type AvatarColor = 'default' | 'one' | 'two' | 'three' | 'four';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AvatarVariant;
  colorScheme?: AvatarColor;
  size?: AvatarSize;
  initials?: string;
  src?: string;
  alt?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      variant = 'circle-guest',
      colorScheme = 'default',
      size,
      initials,
      src,
      alt = 'Avatar',
      children,
      ...props
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      xs: 'w-6 h-6 text-[9px]',
      sm: 'w-8 h-8 text-[10px]',
      md: 'w-10 h-10 text-xs',
      lg: 'w-12 h-12 text-sm',
      xl: 'w-16 h-16 text-base',
    };

    const hasImage = src && !imageError;

    // Derived initials if not provided but alt is present
    const displayInitials =
      initials ||
      (alt
        ? alt
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : '?');

    return (
      <div
        ref={ref}
        className={cn(
          'grid place-items-center shrink-0 overflow-hidden relative select-none',
          size
            ? cn(sizeClasses[size], 'rounded-full font-bold text-white bg-[#5A2EA6]')
            : {
                'w-[34px] h-[34px] border-[1.5px] border-white/20 rounded-lg font-serif italic text-xl text-[#f4e7ce] bg-white/5 shadow-[0_8px_20px_rgba(232,184,75,0.25)]':
                  variant === 'square-monogram',
                'w-[30px] h-[30px] rounded-full text-[10px] font-bold text-white bg-[#b56e53] shadow-[0_8px_20px_rgba(0,0,0,0.15)]':
                  variant === 'circle-profile',
                'w-[32px] h-[32px] rounded-full text-[10px] font-bold text-white tracking-[0.3px]':
                  variant === 'circle-guest',
                'bg-[#8d6355]': variant === 'circle-guest' && colorScheme === 'one',
                'bg-[#4a647a]': variant === 'circle-guest' && colorScheme === 'two',
                'bg-[#a86878]': variant === 'circle-guest' && colorScheme === 'three',
                'bg-[#7a6850]': variant === 'circle-guest' && colorScheme === 'four',
              },
          className,
        )}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          displayInitials || children
        )}
      </div>
    );
  },
);
Avatar.displayName = 'Avatar';
