'use client';

import React from 'react';
import { renderMarkdown } from '@/utils/markdown';
import { MarkdownRendererProps } from '@/types/game';

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '', 
  components = {} 
}) => {
  return renderMarkdown({ content, className, components });
};

export default MarkdownRenderer;
