import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  darkColor?: string;
};

export function ThemedView({ style, darkColor = '#010f13', ...otherProps }: ThemedViewProps) {
  // Always use dark color
  const backgroundColor = darkColor || useThemeColor({ dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
