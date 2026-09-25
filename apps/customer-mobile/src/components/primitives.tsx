import type React from 'react';
import {
  type ImageSourcePropType,
  type ImageStyle,
  Image as RNImage,
  Modal as RNModal,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

export interface PrimitiveProps {
  className?: string;
  style?: StyleProp<ViewStyle & TextStyle & ImageStyle>;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const isWeb = typeof document !== 'undefined';

// Safe child processor for React Native to ensure strings are ALWAYS wrapped in <RNText> with button centering
function renderSafeRNChildren(nodes: React.ReactNode, isInsideButton = false): React.ReactNode {
  if (nodes === null || nodes === undefined || typeof nodes === 'boolean') {
    return null;
  }
  if (typeof nodes === 'string' || typeof nodes === 'number') {
    return <RNText style={isInsideButton ? { textAlign: 'center' } : undefined}>{nodes}</RNText>;
  }
  if (Array.isArray(nodes)) {
    return nodes.map((node, index) => {
      if (typeof node === 'string' || typeof node === 'number') {
        return (
          <RNText key={index} style={isInsideButton ? { textAlign: 'center' } : undefined}>
            {node}
          </RNText>
        );
      }
      return node;
    });
  }
  return nodes;
}

// Native Full Screen Modal Overlay for Mobile (Prevents background scrolling and covers entire phone screen)
export const ModalOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  if (isWeb) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
        {children}
      </div>
    );
  }

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <RNView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}
      >
        {children}
      </RNView>
    </RNModal>
  );
};

// Comprehensive Tailwind className to RN style parser for Native (Expo Go)
function parseTailwindToRNStyle(className?: string): StyleProp<ViewStyle & TextStyle & ImageStyle> {
  if (!className) return {};
  const styles: any = {};
  const tokens = className.split(/\s+/);

  for (const token of tokens) {
    if (!token) continue;

    // Custom Hex Colors & Dynamic Dimensions
    if (token.startsWith('bg-[#') && token.endsWith(']')) {
      styles.backgroundColor = token.slice(4, -1);
      continue;
    }
    if (token.startsWith('text-[#') && token.endsWith(']')) {
      styles.color = token.slice(6, -1);
      continue;
    }
    if (token.startsWith('border-[#') && token.endsWith(']')) {
      styles.borderWidth = 1;
      styles.borderColor = token.slice(8, -1);
      continue;
    }

    // Dynamic Padding Parsers (including pl- and pr-)
    if (token.startsWith('py-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingVertical = val * 4;
        continue;
      }
    } else if (token.startsWith('px-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingHorizontal = val * 4;
        continue;
      }
    } else if (token.startsWith('pl-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingLeft = val * 4;
        continue;
      }
    } else if (token.startsWith('pr-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingRight = val * 4;
        continue;
      }
    } else if (token.startsWith('pt-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingTop = val * 4;
        continue;
      }
    } else if (token.startsWith('pb-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.paddingBottom = val * 4;
        continue;
      }
    } else if (token.startsWith('p-')) {
      const val = Number.parseFloat(token.slice(2));
      if (!isNaN(val)) {
        styles.padding = val * 4;
        continue;
      }
    }

    // Dynamic Margin Parsers
    if (token.startsWith('my-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.marginVertical = val * 4;
        continue;
      }
    } else if (token.startsWith('mx-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.marginHorizontal = val * 4;
        continue;
      }
    } else if (token.startsWith('mt-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.marginTop = val * 4;
        continue;
      }
    } else if (token.startsWith('mb-')) {
      const val = Number.parseFloat(token.slice(3));
      if (!isNaN(val)) {
        styles.marginBottom = val * 4;
        continue;
      }
    } else if (token.startsWith('m-')) {
      const val = Number.parseFloat(token.slice(2));
      if (!isNaN(val)) {
        styles.margin = val * 4;
        continue;
      }
    }

    // Align Self
    if (token === 'self-start') {
      styles.alignSelf = 'flex-start';
    } else if (token === 'self-center') {
      styles.alignSelf = 'center';
    } else if (token === 'self-end') {
      styles.alignSelf = 'flex-end';
    }

    // Flexbox Alignment
    if (token === 'flex') {
      styles.display = 'flex';
    } else if (token === 'inline-flex') {
      styles.display = 'flex';
      styles.flexDirection = 'row';
    } else if (token === 'flex-row') {
      styles.flexDirection = 'row';
    } else if (token === 'flex-col') {
      styles.flexDirection = 'column';
    } else if (token === 'flex-1') {
      styles.flex = 1;
    } else if (token === 'flex-shrink-0') {
      styles.flexShrink = 0;
    } else if (token === 'flex-wrap') {
      styles.flexWrap = 'wrap';
    } else if (token === 'min-h-screen') {
      styles.flex = 1;
    } else if (token === 'items-center') {
      styles.alignItems = 'center';
    } else if (token === 'items-start') {
      styles.alignItems = 'flex-start';
    } else if (token === 'items-end' || token === 'items-baseline') {
      styles.alignItems = 'flex-end';
    } else if (token === 'justify-between') {
      styles.justifyContent = 'space-between';
    } else if (token === 'justify-center') {
      styles.justifyContent = 'center';
    } else if (token === 'justify-around') {
      styles.justifyContent = 'space-around';
    } else if (token === 'text-center') {
      styles.textAlign = 'center';
    } else if (token === 'text-right') {
      styles.textAlign = 'right';
    } else if (token === 'truncate') {
      styles.overflow = 'hidden';
    }

    // Positioning & Inset Parsers for Full-Screen Modals & Floating Toasts
    if (token === 'inset-0') {
      styles.top = 0;
      styles.bottom = 0;
      styles.left = 0;
      styles.right = 0;
      styles.width = '100%';
      styles.height = '100%';
    } else if (token === 'fixed' || token === 'absolute') {
      styles.position = 'absolute';
    } else if (token === 'relative') {
      styles.position = 'relative';
    } else if (token.startsWith('top-')) {
      const val = Number.parseFloat(token.slice(4));
      if (!isNaN(val)) styles.top = val * 4;
    } else if (token.startsWith('bottom-')) {
      const val = Number.parseFloat(token.slice(7));
      if (!isNaN(val)) styles.bottom = val * 4;
    } else if (token.startsWith('left-')) {
      const val = Number.parseFloat(token.slice(5));
      if (!isNaN(val)) styles.left = val * 4;
    } else if (token.startsWith('right-')) {
      const val = Number.parseFloat(token.slice(6));
      if (!isNaN(val)) styles.right = val * 4;
    } else if (token === 'z-50' || token.startsWith('z-[')) {
      styles.zIndex = 9999;
    } else if (token === 'z-10') {
      styles.zIndex = 10;
    }

    // Dynamic Gap Parser
    if (token.startsWith('space-y-')) {
      const val = Number.parseFloat(token.slice(8));
      if (!isNaN(val)) styles.gap = val * 4;
    } else if (token.startsWith('gap-')) {
      const val = Number.parseFloat(token.slice(4));
      if (!isNaN(val)) styles.gap = val * 4;
    }

    // Grid
    if (token.startsWith('grid')) {
      styles.display = 'flex';
      styles.flexDirection = 'row';
      styles.flexWrap = 'wrap';
    }

    // Background colors with Modal Overlay & Toast Support
    if (token.startsWith('bg-slate-900')) {
      styles.backgroundColor = '#0f172a';
    } else if (
      token === 'bg-black/60' ||
      token === 'bg-black/70' ||
      token === 'bg-black/50' ||
      token === 'bg-black/80'
    ) {
      styles.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    } else if (
      token === 'bg-white' ||
      token === 'bg-white/90' ||
      token === 'bg-white/95' ||
      token === 'bg-white/80'
    )
      styles.backgroundColor = '#ffffff';
    else if (token === 'bg-white/20' || token === 'bg-white/25' || token === 'bg-white/30')
      styles.backgroundColor = 'rgba(255, 255, 255, 0.25)';
    else if (
      token.startsWith('bg-gradient') ||
      token === 'bg-purple-900' ||
      token === 'bg-[#7C3AED]' ||
      token === 'bg-purple-800'
    )
      styles.backgroundColor = '#7c3aed';
    else if (token === 'bg-purple-700') styles.backgroundColor = '#7c3aed';
    else if (
      token === 'bg-purple-600/60' ||
      token === 'bg-purple-600/50' ||
      token === 'bg-purple-600'
    )
      styles.backgroundColor = 'rgba(147, 51, 234, 0.5)';
    else if (token === 'bg-[#E9D5FF]') styles.backgroundColor = '#e9d5ff';
    else if (
      token === 'bg-purple-50' ||
      token === 'bg-purple-50/40' ||
      token === 'bg-purple-50/50' ||
      token === 'bg-purple-50/70'
    )
      styles.backgroundColor = '#faf5ff';
    else if (
      token === 'bg-purple-100' ||
      token === 'bg-purple-100/70' ||
      token === 'bg-purple-100/80'
    )
      styles.backgroundColor = '#f3e8ff';
    else if (token === 'bg-amber-50') styles.backgroundColor = '#fffbeb';
    else if (token === 'bg-amber-100' || token === 'bg-amber-100/80' || token === 'bg-amber-100/90')
      styles.backgroundColor = '#fef3c7';
    else if (
      token === 'bg-amber-200' ||
      token === 'bg-amber-200/90' ||
      token === 'bg-amber-200/80' ||
      token === 'bg-amber-200/60'
    )
      styles.backgroundColor = '#fde68a';
    else if (token === 'bg-emerald-950/60' || token === 'bg-emerald-950')
      styles.backgroundColor = 'rgba(2, 44, 34, 0.7)';
    else if (token === 'bg-emerald-50' || token === 'bg-emerald-50/50')
      styles.backgroundColor = '#ecfdf5';
    else if (token === 'bg-emerald-100') styles.backgroundColor = '#d1fae5';
    else if (token === 'bg-blue-50') styles.backgroundColor = '#eff6ff';
    else if (token === 'bg-rose-50') styles.backgroundColor = '#fff1f2';
    else if (token === 'bg-rose-100' || token === 'bg-rose-100/80' || token === 'bg-[#ffe4e6]')
      styles.backgroundColor = '#ffe4e6';
    else if (token === 'bg-rose-600' || token === 'bg-rose-700' || token === 'bg-[#e11d48]')
      styles.backgroundColor = '#e11d48';
    else if (token === 'bg-gray-50') styles.backgroundColor = '#f9fafb';
    else if (token === 'bg-gray-100') styles.backgroundColor = '#f3f4f6';
    else if (token === 'bg-gray-200') styles.backgroundColor = '#e5e7eb';

    // Text colors
    if (token === 'text-white') styles.color = '#ffffff';
    else if (token === 'text-purple-200') styles.color = '#e9d5ff';
    else if (token === 'text-purple-700') styles.color = '#7c3aed';
    else if (token === 'text-purple-800') styles.color = '#6d28d9';
    else if (token === 'text-purple-900') styles.color = '#4c1d95';
    else if (token === 'text-gray-900') styles.color = '#111827';
    else if (token === 'text-gray-800') styles.color = '#1f2937';
    else if (token === 'text-gray-700') styles.color = '#374151';
    else if (token === 'text-gray-600') styles.color = '#4b5563';
    else if (token === 'text-gray-500') styles.color = '#6b7280';
    else if (token === 'text-gray-400') styles.color = '#9ca3af';
    else if (token === 'text-gray-300') styles.color = '#d1d5db';
    else if (token === 'text-amber-800') styles.color = '#92400e';
    else if (token === 'text-amber-900') styles.color = '#78350f';
    else if (token === 'text-amber-950') styles.color = '#451a03';
    else if (token === 'text-emerald-300') styles.color = '#6ee7b7';
    else if (token === 'text-emerald-600') styles.color = '#059669';
    else if (token === 'text-emerald-700') styles.color = '#047857';
    else if (token === 'text-emerald-800') styles.color = '#065f46';
    else if (token === 'text-rose-600') styles.color = '#e11d48';
    else if (token === 'text-rose-700') styles.color = '#be123c';
    else if (token === 'text-blue-700') styles.color = '#1d4ed8';

    // Font Sizes
    if (token === 'text-[9px]') styles.fontSize = 9;
    else if (token === 'text-[10px]') styles.fontSize = 10;
    else if (token === 'text-[11px]') styles.fontSize = 11;
    else if (token === 'text-xs') styles.fontSize = 12;
    else if (token === 'text-sm') styles.fontSize = 14;
    else if (token === 'text-base') styles.fontSize = 16;
    else if (token === 'text-lg') styles.fontSize = 18;
    else if (token === 'text-xl') styles.fontSize = 20;
    else if (token === 'text-2xl') styles.fontSize = 24;
    else if (token === 'text-3xl') styles.fontSize = 28;
    else if (token === 'text-4xl') styles.fontSize = 36;

    // Font Weights
    if (token === 'font-black') styles.fontWeight = '900';
    else if (token === 'font-extrabold') styles.fontWeight = '800';
    else if (token === 'font-bold') styles.fontWeight = '700';
    else if (token === 'font-semibold') styles.fontWeight = '600';
    else if (token === 'font-medium') styles.fontWeight = '500';
    else if (token === 'font-normal') styles.fontWeight = '400';

    // Border Radius
    if (token === 'rounded-md') styles.borderRadius = 6;
    else if (token === 'rounded-lg') styles.borderRadius = 8;
    else if (token === 'rounded-xl') styles.borderRadius = 12;
    else if (token === 'rounded-2xl') styles.borderRadius = 16;
    else if (token === 'rounded-3xl') styles.borderRadius = 24;
    else if (token === 'rounded-full') styles.borderRadius = 9999;

    // Width & Height Dimensions (including min-w- and min-h-)
    if (token === 'w-full') styles.width = '100%';
    else if (token === 'h-full') styles.height = '100%';
    else if (token.startsWith('min-w-[')) {
      const val = Number.parseFloat(token.slice(7, -1));
      if (!isNaN(val)) styles.minWidth = val;
    } else if (token.startsWith('min-w-')) {
      const val = Number.parseFloat(token.slice(6));
      if (!isNaN(val)) styles.minWidth = val * 4;
    } else if (token.startsWith('w-[')) {
      const val = Number.parseFloat(token.slice(3, -1));
      if (!isNaN(val)) styles.width = val;
    } else if (token.startsWith('w-')) {
      const val = Number.parseFloat(token.slice(2));
      if (!isNaN(val)) styles.width = val * 4;
    }

    if (token.startsWith('min-h-[')) {
      const val = Number.parseFloat(token.slice(7, -1));
      if (!isNaN(val)) styles.minHeight = val;
    } else if (token.startsWith('min-h-')) {
      const val = Number.parseFloat(token.slice(6));
      if (!isNaN(val)) styles.minHeight = val * 4;
    } else if (token.startsWith('h-[')) {
      const val = Number.parseFloat(token.slice(3, -1));
      if (!isNaN(val)) styles.height = val;
    } else if (token.startsWith('h-')) {
      const val = Number.parseFloat(token.slice(2));
      if (!isNaN(val)) styles.height = val * 4;
    }

    // Border Widths
    if (token === 'border') styles.borderWidth = 1;
    else if (token === 'border-2') styles.borderWidth = 2;
    else if (token === 'border-3') styles.borderWidth = 3;
    else if (token === 'border-4') styles.borderWidth = 4;
    else if (token === 'border-t') styles.borderTopWidth = 1;
    else if (token === 'border-b') styles.borderBottomWidth = 1;

    // Border Colors
    if (token === 'border-purple-50') styles.borderColor = '#faf5ff';
    else if (token === 'border-purple-100') styles.borderColor = '#f3e8ff';
    else if (token === 'border-purple-200') styles.borderColor = '#e9d5ff';
    else if (token === 'border-purple-300') styles.borderColor = '#d8b4fe';
    else if (token === 'border-purple-600' || token === 'border-[#7C3AED]')
      styles.borderColor = '#7c3aed';
    else if (token === 'border-gray-100') styles.borderColor = '#f3f4f6';
    else if (token === 'border-gray-200') styles.borderColor = '#e5e7eb';
    else if (token === 'border-amber-200') styles.borderColor = '#fde68a';
    else if (token === 'border-amber-300') styles.borderColor = '#fcd34d';
    else if (token === 'border-emerald-200' || token === 'border-emerald-500/30') {
      styles.borderWidth = 1;
      styles.borderColor = '#059669';
    } else if (token === 'border-rose-200') styles.borderColor = '#fecdd3';
    else if (token === 'shadow-xs' || token === 'shadow-sm' || token === 'shadow-md') {
      styles.shadowColor = '#000000';
      styles.shadowOffset = { width: 0, height: 1 };
      styles.shadowOpacity = 0.05;
      styles.shadowRadius = 3;
      styles.elevation = 1;
    }
  }

  return styles;
}

export const Div: React.FC<PrimitiveProps> = ({
  children,
  className,
  style,
  onClick,
  onPress,
  ...props
}) => {
  const handlePress = (onPress || onClick) as (() => void) | undefined;

  if (isWeb) {
    if (handlePress) {
      return (
        <div
          className={className}
          style={style as React.CSSProperties}
          onClick={handlePress}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handlePress();
          }}
          {...props}
        >
          {children}
        </div>
      );
    }
    return (
      <div className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </div>
    );
  }

  const rnStyle = [parseTailwindToRNStyle(className), style] as StyleProp<ViewStyle>;

  if (handlePress) {
    return (
      <RNTouchableOpacity onPress={handlePress} style={rnStyle} activeOpacity={0.8} {...props}>
        {renderSafeRNChildren(children)}
      </RNTouchableOpacity>
    );
  }

  const isHorizontalScroll =
    typeof className === 'string' &&
    (className.includes('overflow-x-auto') || className.includes('overflow-x-scroll'));
  if (isHorizontalScroll) {
    return (
      <RNScrollView
        horizontal
        contentContainerStyle={rnStyle}
        showsHorizontalScrollIndicator={false}
        {...props}
      >
        {renderSafeRNChildren(children)}
      </RNScrollView>
    );
  }

  const isRootPage =
    typeof className === 'string' &&
    (className.includes('pb-28') || className.includes('pb-24') || className.includes('pb-20'));
  if (isRootPage) {
    return (
      <RNScrollView contentContainerStyle={rnStyle} showsVerticalScrollIndicator={false} {...props}>
        {renderSafeRNChildren(children)}
      </RNScrollView>
    );
  }

  return (
    <RNView style={rnStyle} {...props}>
      {renderSafeRNChildren(children)}
    </RNView>
  );
};

export const H1: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <h1 className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </h1>
    );
  }
  const rnStyle = [
    { fontSize: 24, fontWeight: '800', color: '#111827' },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const H2: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <h2 className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </h2>
    );
  }
  const rnStyle = [
    { fontSize: 18, fontWeight: '800', color: '#111827' },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const H3: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <h3 className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </h3>
    );
  }
  const rnStyle = [
    { fontSize: 15, fontWeight: '700', color: '#1f2937' },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const H4: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <h4 className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </h4>
    );
  }
  const rnStyle = [
    { fontSize: 13, fontWeight: '700', color: '#1f2937' },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const P: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <p className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </p>
    );
  }
  const rnStyle = [
    { fontSize: 12, color: '#4b5563' },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const Span: React.FC<PrimitiveProps> = ({ children, className, style, ...props }) => {
  if (isWeb) {
    return (
      <span className={className} style={style as React.CSSProperties} {...props}>
        {children}
      </span>
    );
  }
  const rnStyle = [parseTailwindToRNStyle(className), style] as StyleProp<TextStyle>;
  return (
    <RNText style={rnStyle} {...props}>
      {children}
    </RNText>
  );
};

export const Button: React.FC<PrimitiveProps> = ({
  children,
  className,
  style,
  onClick,
  onPress,
  type = 'button',
  ...props
}) => {
  const handlePress = (onPress || onClick) as (() => void) | undefined;

  if (isWeb) {
    return (
      <button
        type={type as 'button' | 'submit' | 'reset'}
        className={className}
        style={style as React.CSSProperties}
        onClick={handlePress}
        {...props}
      >
        {children}
      </button>
    );
  }

  const parsedStyle = parseTailwindToRNStyle(className);
  // Ensure default center alignment for RNTouchableOpacity on mobile so buttons center icons and text
  const buttonDefaultStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const rnStyle = [buttonDefaultStyle, parsedStyle, style] as StyleProp<ViewStyle>;

  return (
    <RNTouchableOpacity onPress={handlePress} style={rnStyle} activeOpacity={0.75} {...props}>
      {renderSafeRNChildren(children, true)}
    </RNTouchableOpacity>
  );
};

export const Img: React.FC<
  PrimitiveProps & { src?: string | ImageSourcePropType; alt?: string }
> = ({ src, alt, className, style, ...props }) => {
  if (isWeb) {
    const imgSrc = typeof src === 'string' ? src : (src as any)?.uri || '';
    return (
      <img
        src={imgSrc}
        alt={alt || ''}
        className={className}
        style={style as React.CSSProperties}
        {...props}
      />
    );
  }

  const imageSource: ImageSourcePropType =
    typeof src === 'string' ? { uri: src } : src || { uri: '' };
  const rnStyle = [
    { resizeMode: 'cover' as const },
    parseTailwindToRNStyle(className),
    style,
  ] as StyleProp<ImageStyle>;
  return <RNImage source={imageSource} style={rnStyle} {...props} />;
};

export const Input: React.FC<
  PrimitiveProps & {
    value?: string;
    placeholder?: string;
    type?: string;
    readOnly?: boolean;
    onChange?: (e: { target: { value: string } }) => void;
  }
> = ({
  value,
  onChange,
  onChangeText,
  placeholder,
  className,
  style,
  readOnly,
  type = 'text',
  ...props
}) => {
  if (isWeb) {
    return (
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        className={className}
        style={style as React.CSSProperties}
        onChange={onChange as any}
        {...props}
      />
    );
  }

  const rnStyle = [parseTailwindToRNStyle(className), style] as StyleProp<TextStyle>;

  return (
    <RNTextInput
      value={value}
      editable={!readOnly}
      onChangeText={(text) => {
        if (typeof onChangeText === 'function') (onChangeText as (t: string) => void)(text);
        if (typeof onChange === 'function')
          (onChange as (e: { target: { value: string } }) => void)({ target: { value: text } });
      }}
      placeholder={placeholder}
      style={rnStyle}
      {...props}
    />
  );
};
