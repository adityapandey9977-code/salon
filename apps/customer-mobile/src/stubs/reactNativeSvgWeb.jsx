import React from 'react';

export const Svg = React.forwardRef((props, ref) => {
  const { width, height, viewBox, fill = 'none', stroke, children, style, ...rest } = props;
  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
});
Svg.displayName = 'Svg';

export const Path = (props) => <path {...props} />;
export const Rect = (props) => <rect {...props} />;
export const Circle = (props) => <circle {...props} />;
export const Line = (props) => <line {...props} />;
export const Polygon = (props) => <polygon {...props} />;
export const Polyline = (props) => <polyline {...props} />;
export const G = (props) => <g {...props} />;
export const Defs = (props) => <defs {...props} />;
export const Stop = (props) => <stop {...props} />;
export const LinearGradient = (props) => <linearGradient {...props} />;
export const RadialGradient = (props) => <radialGradient {...props} />;
export const ClipPath = (props) => <clipPath {...props} />;
export const Text = (props) => <text {...props} />;
export const TSpan = (props) => <tspan {...props} />;

export default Svg;
