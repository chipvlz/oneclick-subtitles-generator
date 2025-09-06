import { SubtitleCustomization } from '../types';

// Default customization settings - only export this for server use
export const defaultCustomization: SubtitleCustomization = {
  fontSize: 28,
  fontFamily: 'Inter',
  fontWeight: 600,
  textColor: '#ffffff',
  textAlign: 'center',
  lineHeight: 1.2,
  letterSpacing: 0,
  textTransform: 'none',

  backgroundColor: '#000000',
  backgroundOpacity: 50,
  borderRadius: 4,
  borderWidth: 0,
  borderColor: '#ffffff',
  borderStyle: 'none',

  textShadowEnabled: true,
  textShadowColor: '#000000',
  textShadowBlur: 4,
  textShadowOffsetX: 0,
  textShadowOffsetY: 2,
  glowEnabled: false,
  glowColor: '#ffffff',
  glowIntensity: 10,

  // Advanced gradient effects
  gradientEnabled: false,
  gradientType: 'linear',
  gradientDirection: '45deg',
  gradientColorStart: '#ffffff',
  gradientColorEnd: '#cccccc',
  gradientColorMid: '#eeeeee',

  // Advanced text effects
  strokeEnabled: false,
  strokeWidth: 2,
  strokeColor: '#000000',
  multiShadowEnabled: false,
  shadowLayers: 1,

  // Kinetic effects
  pulseEnabled: false,
  pulseSpeed: 1,
  shakeEnabled: false,
  shakeIntensity: 2,

  position: 'bottom',
  customPositionX: 50,
  customPositionY: 80,
  marginBottom: 80,
  marginTop: 80,
  marginLeft: 0,
  marginRight: 0,
  maxWidth: 80,

  fadeInDuration: 0.3,
  fadeOutDuration: 0.3,
  animationType: 'fade',
  animationEasing: 'ease',

  wordWrap: true,
  maxLines: 3,
  lineBreakBehavior: 'auto',
  rtlSupport: false,

  preset: 'default'
};
