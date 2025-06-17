/**
 * Comprehensive font options with multilingual support
 * Based on video-renderer font options with additional fonts
 */

export const fontOptions = [
  // Korean optimized fonts
  { value: "'Noto Sans KR', sans-serif", label: 'Noto Sans Korean', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Nanum Gothic', sans-serif", label: 'Nanum Gothic', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Malgun Gothic', sans-serif", label: 'Malgun Gothic', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Nanum Myeongjo', serif", label: 'Nanum Myeongjo', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Nanum Barun Gothic', sans-serif", label: 'Nanum Barun Gothic', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Spoqa Han Sans', sans-serif", label: 'Spoqa Han Sans', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'KoPub Batang', serif", label: 'KoPub Batang', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },
  { value: "'Gowun Dodum', sans-serif", label: 'Gowun Dodum', group: 'Korean Optimized', koreanSupport: true, vietnameseSupport: false },

  // Vietnamese optimized fonts
  { value: "'Google Sans', 'Be Vietnam Pro', sans-serif", label: 'Google Sans', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Noto Sans Vietnamese', sans-serif", label: 'Noto Sans Vietnamese', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Be Vietnam Pro', sans-serif", label: 'Be Vietnam Pro', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Sarabun', sans-serif", label: 'Sarabun', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Montserrat Alternates', sans-serif", label: 'Montserrat Alternates', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Josefin Sans', sans-serif", label: 'Josefin Sans', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },
  { value: "'Lexend', sans-serif", label: 'Lexend', group: 'Vietnamese Optimized', koreanSupport: false, vietnameseSupport: true },

  // Multilingual fonts with good support for both Korean and Vietnamese
  { value: "'Google Sans', 'Open Sans', sans-serif", label: 'Google Sans', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Open Sans', sans-serif", label: 'Open Sans', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Noto Sans', sans-serif", label: 'Noto Sans', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Noto Serif', serif", label: 'Noto Serif', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Arial Unicode MS', sans-serif", label: 'Arial Unicode', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Source Sans Pro', sans-serif", label: 'Source Sans Pro', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Arial', sans-serif", label: 'Arial', group: 'Multilingual', koreanSupport: false, vietnameseSupport: false },
  { value: "'Helvetica', sans-serif", label: 'Helvetica', group: 'Multilingual', koreanSupport: false, vietnameseSupport: false },
  { value: "'Roboto', sans-serif", label: 'Roboto', group: 'Multilingual', koreanSupport: true, vietnameseSupport: true },
  { value: "'Montserrat', sans-serif", label: 'Montserrat', group: 'Multilingual', koreanSupport: false, vietnameseSupport: true },
  { value: "'Poppins', sans-serif", label: 'Poppins', group: 'Multilingual', koreanSupport: false, vietnameseSupport: true },

  // Chinese optimized fonts
  { value: "'Noto Sans SC', sans-serif", label: 'Noto Sans Simplified Chinese', group: 'Chinese Optimized', chineseSupport: true },
  { value: "'Noto Sans TC', sans-serif", label: 'Noto Sans Traditional Chinese', group: 'Chinese Optimized', chineseSupport: true },
  { value: "'Source Han Sans', sans-serif", label: 'Source Han Sans', group: 'Chinese Optimized', chineseSupport: true },
  { value: "'PingFang SC', sans-serif", label: 'PingFang SC', group: 'Chinese Optimized', chineseSupport: true },

  // Japanese optimized fonts
  { value: "'Noto Sans JP', sans-serif", label: 'Noto Sans Japanese', group: 'Japanese Optimized', japaneseSupport: true },
  { value: "'Hiragino Sans', sans-serif", label: 'Hiragino Sans', group: 'Japanese Optimized', japaneseSupport: true },
  { value: "'Yu Gothic', sans-serif", label: 'Yu Gothic', group: 'Japanese Optimized', japaneseSupport: true },

  // Arabic optimized fonts
  { value: "'Noto Sans Arabic', sans-serif", label: 'Noto Sans Arabic', group: 'Arabic Optimized', arabicSupport: true, rtl: true },
  { value: "'Amiri', serif", label: 'Amiri', group: 'Arabic Optimized', arabicSupport: true, rtl: true },
  { value: "'Cairo', sans-serif", label: 'Cairo', group: 'Arabic Optimized', arabicSupport: true, rtl: true },

  // Standard sans-serif fonts
  { value: "'Poppins', sans-serif", label: 'Poppins', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Inter', sans-serif", label: 'Inter', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Roboto', sans-serif", label: 'Roboto', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Montserrat', sans-serif", label: 'Montserrat', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Arial', sans-serif", label: 'Arial', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Helvetica', sans-serif", label: 'Helvetica', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Tahoma', sans-serif", label: 'Tahoma', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Verdana', sans-serif", label: 'Verdana', group: 'Sans-serif', koreanSupport: false, vietnameseSupport: true },

  // Serif fonts
  { value: "'Georgia', serif", label: 'Georgia', group: 'Serif', koreanSupport: false, vietnameseSupport: false },
  { value: "'Times New Roman', serif", label: 'Times New Roman', group: 'Serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Playfair Display', serif", label: 'Playfair Display', group: 'Serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Cormorant Garamond', serif", label: 'Cormorant Garamond', group: 'Serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Merriweather', serif", label: 'Merriweather', group: 'Serif', koreanSupport: false, vietnameseSupport: true },
  { value: "'Lora', serif", label: 'Lora', group: 'Serif', koreanSupport: false, vietnameseSupport: true },

  // Monospace fonts
  { value: "'Nanum Gothic Coding', monospace", label: 'Nanum Gothic Coding', group: 'Monospace', koreanSupport: true, vietnameseSupport: false },
  { value: "'JetBrains Mono', monospace", label: 'JetBrains Mono', group: 'Monospace', koreanSupport: false, vietnameseSupport: true },
  { value: "'Courier New', monospace", label: 'Courier New', group: 'Monospace', koreanSupport: false, vietnameseSupport: false },
  { value: "'Fira Code', monospace", label: 'Fira Code', group: 'Monospace', koreanSupport: false, vietnameseSupport: true },

  // Display fonts
  { value: "'Impact', sans-serif", label: 'Impact', group: 'Display', koreanSupport: false, vietnameseSupport: false },
  { value: "'Orbitron', sans-serif", label: 'Orbitron', group: 'Display', koreanSupport: false, vietnameseSupport: true },
  { value: "'Oswald', sans-serif", label: 'Oswald', group: 'Display', koreanSupport: false, vietnameseSupport: true },
  { value: "'Bebas Neue', sans-serif", label: 'Bebas Neue', group: 'Display', koreanSupport: false, vietnameseSupport: false },
  { value: "'Anton', sans-serif", label: 'Anton', group: 'Display', koreanSupport: false, vietnameseSupport: false },
  { value: "'Audiowide', cursive", label: 'Audiowide', group: 'Display', koreanSupport: false, vietnameseSupport: false },

  // Creative & Artistic fonts
  { value: "'Creepster', cursive", label: 'Creepster', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Nosifer', cursive", label: 'Nosifer', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Bungee', cursive", label: 'Bungee', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Fredoka One', cursive", label: 'Fredoka One', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Kalam', cursive", label: 'Kalam', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Bangers', cursive", label: 'Bangers', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Righteous', cursive", label: 'Righteous', group: 'Creative', koreanSupport: false, vietnameseSupport: false },
  { value: "'Comic Sans MS', cursive", label: 'Comic Sans MS', group: 'Creative', koreanSupport: false, vietnameseSupport: false },

  // Elegant & Luxury fonts
  { value: "'Cinzel', serif", label: 'Cinzel', group: 'Elegant', koreanSupport: false, vietnameseSupport: false },
  { value: "'Crimson Text', serif", label: 'Crimson Text', group: 'Elegant', koreanSupport: false, vietnameseSupport: false },
  { value: "'Libre Baskerville', serif", label: 'Libre Baskerville', group: 'Elegant', koreanSupport: false, vietnameseSupport: false },

  // Gaming & Tech fonts
  { value: "'Press Start 2P', cursive", label: 'Press Start 2P', group: 'Gaming', koreanSupport: false, vietnameseSupport: false },
  { value: "'VT323', monospace", label: 'VT323', group: 'Gaming', koreanSupport: false, vietnameseSupport: false },
  { value: "'Share Tech Mono', monospace", label: 'Share Tech Mono', group: 'Gaming', koreanSupport: false, vietnameseSupport: false },

  // Cute & Kawaii fonts
  { value: "'Nunito', sans-serif", label: 'Nunito', group: 'Cute', koreanSupport: false, vietnameseSupport: true },
  { value: "'Quicksand', sans-serif", label: 'Quicksand', group: 'Cute', koreanSupport: false, vietnameseSupport: true },
  { value: "'Comfortaa', cursive", label: 'Comfortaa', group: 'Cute', koreanSupport: false, vietnameseSupport: false }
];

// Animation types
export const animationTypes = [
  { value: 'fade', label: 'Fade In/Out' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
  { value: 'typewriter', label: 'Typewriter' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'flip', label: 'Flip' },
  { value: 'rotate', label: 'Rotate' }
];

// Animation easing options
export const animationEasing = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Smooth' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' }
];

// Font weight options
export const fontWeightOptions = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Normal' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' }
];

// Text alignment options
export const textAlignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' }
];

// Text transform options
export const textTransformOptions = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' }
];

// Border style options
export const borderStyleOptions = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' }
];

// Position options
export const positionOptions = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'custom', label: 'Custom' }
];

/**
 * Group fonts by category
 * @param {Array} fonts - Array of font options
 * @returns {Object} - Grouped fonts by category
 */
export const groupFontsByCategory = (fonts = fontOptions) => {
  return fonts.reduce((groups, font) => {
    if (!groups[font.group]) {
      groups[font.group] = [];
    }
    groups[font.group].push(font);
    return groups;
  }, {});
};

/**
 * Get font support flags for display
 * @param {Object} font - Font object
 * @returns {String} - Support flags as emoji string
 */
export const getFontSupportFlags = (font) => {
  let flags = '';
  if (font.koreanSupport) flags += '🇰🇷';
  if (font.vietnameseSupport) flags += '🇻🇳';
  if (font.chineseSupport) flags += '🇨🇳';
  if (font.japaneseSupport) flags += '🇯🇵';
  if (font.arabicSupport) flags += '🇸🇦';
  if (font.rtl) flags += '↩️';
  return flags;
};

/**
 * Get sample text for a font based on its language support
 * @param {Object} font - Font object
 * @returns {String} - Sample text in appropriate language
 */
export const getFontSampleText = (font) => {
  // Korean optimized fonts
  if (font.koreanSupport && font.group === 'Korean Optimized') {
    return '한글 샘플 텍스트';
  }

  // Vietnamese optimized fonts
  if (font.vietnameseSupport && font.group === 'Vietnamese Optimized') {
    return 'Văn bản tiếng Việt';
  }

  // Chinese optimized fonts
  if (font.chineseSupport) {
    return font.label.includes('Simplified') ? '简体中文样本' : '繁體中文樣本';
  }

  // Japanese optimized fonts
  if (font.japaneseSupport) {
    return '日本語サンプル';
  }

  // Arabic optimized fonts
  if (font.arabicSupport) {
    return 'نص عربي نموذجي';
  }

  // Multilingual fonts - show mixed text
  if (font.group === 'Multilingual') {
    if (font.koreanSupport && font.vietnameseSupport) {
      return 'Sample • 샘플 • Mẫu';
    } else if (font.koreanSupport) {
      return 'Sample • 샘플';
    } else if (font.vietnameseSupport) {
      return 'Sample • Mẫu';
    }
  }

  // Display fonts - show stylized text
  if (font.group === 'Display') {
    return 'DISPLAY FONT';
  }

  // Monospace fonts
  if (font.group === 'Monospace') {
    return 'Code Sample';
  }

  // Serif fonts
  if (font.group === 'Serif') {
    return 'Elegant Text';
  }

  // Default for sans-serif and others
  return 'Sample Text';
};

/**
 * Get recommended fonts for a specific language
 * @param {String} language - Language code (ko, vi, zh, ja, ar, etc.)
 * @returns {Array} - Recommended fonts for the language
 */
export const getRecommendedFonts = (language) => {
  const languageMap = {
    ko: fontOptions.filter(f => f.koreanSupport),
    vi: fontOptions.filter(f => f.vietnameseSupport),
    zh: fontOptions.filter(f => f.chineseSupport),
    ja: fontOptions.filter(f => f.japaneseSupport),
    ar: fontOptions.filter(f => f.arabicSupport),
    en: fontOptions.filter(f => f.group === 'Sans-serif' || f.group === 'Serif')
  };

  return languageMap[language] || fontOptions.filter(f => f.group === 'Multilingual');
};
