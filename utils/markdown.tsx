import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sanitizeMarkdownDomProps } from '@/lib/runtime-helpers';
import { MarkdownRendererProps } from '@/types/game';

// 提取 YouTube 视频 ID 的工具函数
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

// YouTube 视频组件
const YouTubeComponent = ({ videoId, title = 'YouTube video' }: { videoId: string; title?: string }) => {
  return (
    <span className="block max-w-4xl mx-auto my-12 px-8 sm:px-12 md:px-16">
      <span className="relative w-full block" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </span>
    </span>
  );
};



// 自定义图片组件  
const ImageComponent = ({ src, alt, ...props }: any) => {
  const safeProps = sanitizeMarkdownDomProps(props);

  return (
    <span className="block">
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-md max-w-full h-auto mx-auto block my-4"
        loading="lazy"
        style={{ 
          margin: '16px auto', 
          display: 'block',
          textAlign: 'center'
        }}
        {...safeProps}
      />
      {alt && (
        <span className="block text-theme-sm text-helper mb-theme-md text-center italic"
              style={{ 
                display: 'block',
                textAlign: 'center',
                marginTop: '8px'
              }}>
          {alt}
        </span>
      )}
    </span>
  );
};

// 自定义链接组件
const LinkComponent = ({ href, children, ...props }: any) => {
  const safeProps = sanitizeMarkdownDomProps(props);
  const isExternal = href?.startsWith('http');

    // 检查是否为 YouTube 链接
  if (href && isExternal) {
    const youtubeId = extractYouTubeId(href);
    if (youtubeId) {
      // 所有 YouTube 链接都渲染为视频播放器
      const title = typeof children === 'string' ? children : 'YouTube 视频';
      return <YouTubeComponent videoId={youtubeId} title={title} />;
    }
  }
  
  return (
    <a
      href={href}
      className="text-theme-fire-400 hover:text-theme-fire-300 underline transition-colors"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...safeProps}
    >
      {children}
    </a>
  );
};

// 默认组件配置
const defaultComponents = {
  img: ImageComponent,
  a: LinkComponent,
  h1: ({ children, ...props }: any) => (
    <h1 className="text-theme-3xl font-theme-heading font-bold text-primary mb-theme-lg mt-theme-2xl" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-theme-2xl font-theme-heading font-semibold text-primary mb-theme-md mt-theme-lg" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-theme-xl font-theme-heading font-medium text-primary mb-theme-sm mt-theme-md" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-theme-lg font-theme-heading font-medium text-secondary mb-theme-xs mt-theme-sm" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => {
    const safeProps = sanitizeMarkdownDomProps(props);
    // 检查子元素中是否包含块级元素
    const hasBlockElements = React.Children.toArray(children).some(child => 
      React.isValidElement(child) && 
      (child.type === 'div' || child.type === 'section' || child.type === 'article')
    );
    
    // 如果包含块级元素，则使用 span 替代 p 标签
    if (hasBlockElements) {
      return (
        <span className="block text-secondary leading-relaxed mb-theme-md font-theme-body" {...safeProps}>
          {children}
        </span>
      );
    }
    
    return (
      <p className="text-secondary leading-relaxed mb-theme-md font-theme-body" {...safeProps}>
        {children}
      </p>
    );
  },
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-secondary mb-theme-md space-y-1 font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-secondary mb-theme-md space-y-1 font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-secondary font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-theme-fire-500 pl-theme-md italic text-secondary mb-theme-md font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-theme-heading font-semibold text-primary" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-secondary font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </em>
  ),
  del: ({ children, ...props }: any) => (
    <del className="line-through text-helper font-theme-body" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </del>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-theme-dark-800 rounded-lg p-theme-md overflow-x-auto mb-theme-md text-secondary font-theme-mono" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-theme-dark-700 text-accent px-theme-xs py-theme-xs rounded text-theme-sm font-theme-mono" {...sanitizeMarkdownDomProps(props)}>
      {children}
    </code>
  ),
};

// 主渲染函数
export const renderMarkdown = ({ content, className = '', components = {} }: MarkdownRendererProps) => {
  const mergedComponents = { 
    ...defaultComponents, 
    ...components,
  };
  
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={mergedComponents}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// 截断 Markdown 内容
export const truncateMarkdown = (content: string, maxLength: number = 150): string => {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接标记
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片标记
    .replace(/`([^`]+)`/g, '$1') // 移除行内代码标记
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\n+/g, ' ') // 将换行替换为空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // 截断并添加省略号
  return plainText.substring(0, maxLength).trim() + '...';
};

// 提取 Markdown 标题
export const extractMarkdownHeadings = (content: string): string[] => {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1].trim());
  }

  return headings;
};

// 验证 Markdown 内容
export const validateMarkdownContent = (content: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // 检查未闭合的标记
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push('Links must be closed');
  }

  // 检查未闭合的代码块
  const codeBlocks = (content.match(/```/g) || []).length;
  if (codeBlocks % 2 !== 0) {
    errors.push('code blocks must be closed');
  }

  // 检查过长的行
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.length > 100) {
      errors.push(`The ${index + 1} line (${line.length} characters)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
