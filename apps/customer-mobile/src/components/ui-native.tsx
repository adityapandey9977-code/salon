import type React from 'react';
import {
  type ImageProps,
  Platform,
  Image as RNImage,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  View as RNView,
  type TextInputProps,
  type TextProps,
  type TouchableOpacityProps,
  type ViewProps,
} from 'react-native';

export const View: React.FC<ViewProps & { className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  style,
  ...props
}) => {
  return (
    <RNView style={style} {...props}>
      {children}
    </RNView>
  );
};

export const Text: React.FC<TextProps & { className?: string; children?: React.ReactNode }> = ({
  className,
  children,
  style,
  ...props
}) => {
  return (
    <RNText style={style} {...props}>
      {children}
    </RNText>
  );
};

export const TouchableOpacity: React.FC<
  TouchableOpacityProps & { className?: string; children?: React.ReactNode }
> = ({ className, children, style, ...props }) => {
  return (
    <RNTouchableOpacity style={style} activeOpacity={0.7} {...props}>
      {children}
    </RNTouchableOpacity>
  );
};

export const Image: React.FC<ImageProps & { className?: string }> = ({ style, ...props }) => {
  return <RNImage style={style} {...props} />;
};

export const TextInput: React.FC<TextInputProps & { className?: string }> = ({
  style,
  ...props
}) => {
  return <RNTextInput style={style} {...props} />;
};
