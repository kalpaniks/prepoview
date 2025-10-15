'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Eye, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarkdownViewerProps {
  content: string;
  fileName: string;
}

export default function MarkdownViewer({ content, fileName }: MarkdownViewerProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  return (
    <div className="flex h-full flex-col">
      {/* Header with toggle buttons */}
      <div className="border-border-default bg-bg-default border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-fg-default text-sm font-medium">{fileName}</span>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button
              variant={viewMode === 'raw' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('raw')}
              className="flex items-center gap-2"
            >
              <Code2 className="h-4 w-4" />
              <span>Raw</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'preview' ? (
          <div className="prose prose-slate dark:prose-invert max-w-none p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                // Custom components for better styling
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-fg-accent hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
                code: ({ node, inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code
                        className="bg-bg-muted text-fg-default rounded px-1.5 py-0.5 text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className={`${className} bg-bg-muted text-fg-default block rounded p-4 text-sm font-mono overflow-x-auto`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ node, children, ...props }) => (
                  <pre className="bg-bg-muted rounded-lg p-4 overflow-x-auto" {...props}>
                    {children}
                  </pre>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table className="border-border-default min-w-full border" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="border-border-default bg-bg-muted text-fg-default border px-4 py-2 text-left font-semibold"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td className="border-border-default border px-4 py-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-border-default text-fg-muted border-l-4 pl-4 italic"
                    {...props}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-fg-default mb-4 mt-6 text-3xl font-bold first:mt-0"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-fg-default border-border-default mb-3 mt-6 border-b pb-2 text-2xl font-bold first:mt-0"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-fg-default mb-3 mt-5 text-xl font-bold first:mt-0" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-fg-default mb-2 mt-4 text-lg font-bold first:mt-0" {...props} />
                ),
                h5: ({ node, ...props }) => (
                  <h5 className="text-fg-default mb-2 mt-4 text-base font-bold first:mt-0" {...props} />
                ),
                h6: ({ node, ...props }) => (
                  <h6
                    className="text-fg-muted mb-2 mt-4 text-sm font-bold uppercase first:mt-0"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="text-fg-default my-4 list-disc space-y-2 pl-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="text-fg-default my-4 list-decimal space-y-2 pl-6" {...props} />
                ),
                li: ({ node, ...props }) => <li className="text-fg-default" {...props} />,
                p: ({ node, ...props }) => <p className="text-fg-default my-4" {...props} />,
                img: ({ node, ...props }) => (
                  <img className="my-4 max-w-full rounded-lg border border-border-default" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="border-border-default my-6 border-t" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="text-fg-default bg-bg-default h-full overflow-auto p-4 font-mono text-sm">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
