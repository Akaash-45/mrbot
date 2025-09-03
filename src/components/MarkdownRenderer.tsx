import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const parseMarkdown = (text: string) => {
    // Convert **bold** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert `code` to <code>
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    // Convert code blocks ```code``` to <pre><code>
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-3 border"><code class="text-sm font-mono">$1</code></pre>');
    
    // Convert headers
    text = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
    
    // Convert bullet points
    text = text.replace(/^[•\-\*] (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>');
    
    // Convert numbered lists
    text = text.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>');
    
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};
