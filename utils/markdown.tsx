import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownRendererProps } from '@/types/game';

// 自定义图片组件  
const ImageComponent = ({ src, alt, ...props }: any) => {
  return (
    <>
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
        {...props}
      />
      {alt && (
        <span className="block text-sm text-gray-600 mb-4 text-center italic"
              style={{ 
                display: 'block',
                textAlign: 'center',
                marginTop: '8px'
              }}>
          {alt}
        </span>
      )}
    </>
  );
};

// 自定义链接组件
const LinkComponent = ({ href, children, ...props }: any) => {
  const isExternal = href?.startsWith('http');
  
  return (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline transition-colors"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
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
    <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-6" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-5" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-medium text-gray-800 mb-2 mt-4" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-700" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4" {...props}>
      {children}
    </blockquote>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-gray-800" {...props}>
      {children}
    </em>
  ),
  del: ({ children, ...props }: any) => (
    <del className="line-through text-gray-500" {...props}>
      {children}
    </del>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
      {children}
    </code>
  ),
};

// 主渲染函数
export const renderMarkdown = ({ content, className = '', components = {} }: MarkdownRendererProps) => {
  const mergedComponents = { 
    ...defaultComponents, 
    ...components,
    // 添加 div 组件以避免嵌套问题
    div: ({ children, ...props }: any) => (
      <div {...props}>
        {children}
      </div>
    ),
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
    errors.push('链接标记不匹配');
  }

  // 检查未闭合的代码块
  const codeBlocks = (content.match(/```/g) || []).length;
  if (codeBlocks % 2 !== 0) {
    errors.push('代码块未正确闭合');
  }

  // 检查过长的行
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.length > 100) {
      errors.push(`第 ${index + 1} 行过长 (${line.length} 字符)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
