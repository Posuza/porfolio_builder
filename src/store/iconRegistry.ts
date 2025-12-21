import React from 'react';
import type { IconType } from 'react-icons';
import { FiType, FiFileText, FiImage, FiSquare, FiCreditCard, FiList, FiMessageSquare, FiMinus } from 'react-icons/fi';
import { TiThSmallOutline, TiThMenuOutline } from 'react-icons/ti';
import { LuColumns3 } from 'react-icons/lu';
import { BsColumnsGap } from 'react-icons/bs';

// Central registry mapping stable icon keys -> react-icons `IconType`
export const iconRegistry: Record<string, IconType> = {
  header: FiType,
  text: FiFileText,
  image: FiImage,
  button: FiSquare,
  card: FiCreditCard,
  list: FiList,
  quote: FiMessageSquare,
  divider: FiMinus,

  // layout templates / container keys
  grid: TiThSmallOutline,
  'grid-2cols': TiThSmallOutline,
  'single-column': TiThMenuOutline,
  'verticle-column': TiThMenuOutline,
  'vertical-column': TiThMenuOutline,
  horizontal_columns: LuColumns3,
  'column-more': LuColumns3,
  'uneven-grid': BsColumnsGap,
  layout: TiThMenuOutline,
};

export default iconRegistry;
