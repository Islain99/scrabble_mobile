// src/constants/index.ts

export const POINTS_LETTRES: Record<string, number> = {
  'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4,
  'I': 1, 'J': 8, 'K': 10, 'L': 1, 'M': 2, 'N': 1, 'O': 1, 'P': 3,
  'Q': 8, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 10, 'X': 10,
  'Y': 10, 'Z': 10, '*': 0,
};

export const BONUS_MAP: Record<string, string> = {
  '0-0':'TM','0-7':'TM','0-14':'TM','7-0':'TM','7-14':'TM',
  '14-0':'TM','14-7':'TM','14-14':'TM',
  '1-1':'DM','2-2':'DM','3-3':'DM','4-4':'DM',
  '1-13':'DM','2-12':'DM','3-11':'DM','4-10':'DM',
  '13-1':'DM','12-2':'DM','11-3':'DM','10-4':'DM',
  '13-13':'DM','12-12':'DM','11-11':'DM','10-10':'DM','7-7':'DM',
  '1-5':'TL','1-9':'TL','5-1':'TL','5-5':'TL','5-9':'TL','5-13':'TL',
  '9-1':'TL','9-5':'TL','9-9':'TL','9-13':'TL','13-5':'TL','13-9':'TL',
  '0-3':'DL','0-11':'DL','2-6':'DL','2-8':'DL','3-0':'DL','3-7':'DL',
  '3-14':'DL','6-2':'DL','6-6':'DL','6-8':'DL','6-12':'DL',
  '7-3':'DL','7-11':'DL','8-2':'DL','8-6':'DL','8-8':'DL','8-12':'DL',
  '11-0':'DL','11-7':'DL','11-14':'DL','12-6':'DL','12-8':'DL',
  '14-3':'DL','14-11':'DL',
};

export const COLORS = {
  cream:       '#F5EDD6',
  creamDk:     '#E8D9B5',
  tobacco:     '#C8803A',
  tobaccoDk:   '#A05E20',
  brick:       '#B34A2A',
  olive:       '#5E6B3A',
  oliveLt:     '#8A9B56',
  ink:         '#1E1A12',
  inkLt:       '#3D3626',
  muted:       '#8A7E65',
  gold:        '#C8A830',
  goldDk:      '#8A6820',
  boardGreen:  '#2D5A27',
  boardDk:     '#1A3A18',
  tileBg:      '#F0D890',
  tileBorder:  '#C8A830',
  tileShadow:  '#8A6820',
  tileTemp:    '#D4E8A8',
  tileTempBorder: '#7AAA30',
  tileTempShadow: '#4A7A10',
  bonusTM:     '#8B2020',
  bonusDM:     '#C8803A',
  bonusTL:     '#1A4A8A',
  bonusDL:     '#3A7EB8',
  bonusStart:  '#8B4A20',
} as const;

export const FONTS = {
  playfair:    'PlayfairDisplay_700Bold',
  playfairBlack: 'PlayfairDisplay_900Black',
  dmMono:      'DMMono_400Regular',
  dmMonoMedium: 'DMMono_500Medium',
  baskerville: 'LibreBaskerville_400Regular',
  baskervilleItalic: 'LibreBaskerville_400Regular_Italic',
} as const;
