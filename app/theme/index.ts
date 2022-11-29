import { Platform } from 'react-native';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

const colors = {
  primary: 'black',
  secondary: 'gray',
  bg0: '#FFFFFF',
  bg1: '#EDEDED',
  tint: 'orange',
}

const sizes = {
  small: 8,
  medium: 16,
  large: 24,
}

const fonts = {
  sizes: {
    tiny: 10,
    small: 12,
    standard: 18,
    large: 26,
  },
  weights: {
    standard: Platform.OS === 'ios' ? '400' : Platform.OS === 'web' ? '400' : '100' as FontWeight,
    medium: Platform.OS === 'ios' ? '600' : Platform.OS === 'web' ? '500' : '100' as FontWeight,
    bold: Platform.OS === 'ios' ? '800' : '700' as FontWeight,
  },
  families: {
    // weird oneplus slate stuff
    standard: Platform.OS === 'android' ? 'sans-serif' : undefined,
    medium: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
    bold: Platform.OS === 'android' ? 'sans-serif-medium' : undefined,
  },
};

const textStyles = {
  standard: {
    primary: {
      fontSize: fonts.sizes.standard,
      color: colors.primary,
      fontWeight: fonts.weights.standard,
      fontFamily: fonts.families.standard,
    },
    secondary: {
      fontSize: fonts.sizes.standard,
      color: colors.secondary,
      fontWeight: fonts.weights.standard,
      fontFamily: fonts.families.standard,
    }
  }
}

export function useTheme() {
  return { colors, sizes, textStyles }
}