'use client';

import { useCallback, useEffect, useState } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { File, Loader2 } from 'lucide-react';
import type { editor as MonacoEditorNS, IKeyboardEvent } from 'monaco-editor';

interface CodeEditorProps {
  shareId: string;
  selectedFile: string | null;
}

interface FileContent {
  content: string;
  name: string;
  path: string;
  size: number;
  encoding?: string;
}

type Monaco = typeof import('monaco-editor');

const defineGitHubThemes = (monaco: Monaco) => {
  monaco.editor.defineTheme('github-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '#d73a49' },
      { token: 'keyword.control', foreground: '#d73a49' },

      { token: 'string', foreground: '#032f62' },

      { token: 'comment', foreground: '#6a737d', fontStyle: 'italic' },

      { token: 'number', foreground: '#005cc5' },

      { token: 'entity.name.function', foreground: '#6f42c1' },
      { token: 'support.function', foreground: '#6f42c1' },

      { token: 'variable', foreground: '#e36209' },
      { token: 'variable.other', foreground: '#24292e' },

      { token: 'entity.name.type', foreground: '#6f42c1' },
      { token: 'entity.name.class', foreground: '#6f42c1' },

      { token: 'keyword.operator', foreground: '#d73a49' },

      { token: 'punctuation', foreground: '#24292e' },

      { token: 'entity.name.tag', foreground: '#22863a' },
      { token: 'entity.other.attribute-name', foreground: '#6f42c1' },

      { token: 'support.type.property-name', foreground: '#005cc5' },

      { token: 'support.type.property-name.json', foreground: '#032f62' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#24292e',

      'editorLineNumber.foreground': '#1b1f234d',
      'editorLineNumber.activeForeground': '#24292e',

      'editor.lineHighlightBackground': '#f6f8fa',
      'editor.lineHighlightBorder': '#ffffff',

      'editor.selectionBackground': '#0366d625',
      'editor.selectionHighlightBackground': '#0366d615',

      'editorCursor.foreground': '#24292e',

      'scrollbarSlider.background': '#d1d5da88',
      'scrollbarSlider.hoverBackground': '#d1d5daaa',
      'scrollbarSlider.activeBackground': '#d1d5dacc',

      'editorWidget.border': '#e1e4e8',

      'editorWidget.background': '#f6f8fa',
      'input.background': '#ffffff',
      'input.border': '#e1e4e8',

      'editorBracketMatch.background': '#34d05840',
      'editorBracketMatch.border': '#34d058',
    },
  });

  monaco.editor.defineTheme('github-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Keywords
      { token: 'keyword', foreground: '#ff7b72' },
      { token: 'keyword.control', foreground: '#ff7b72' },

      // Strings
      { token: 'string', foreground: '#a5d6ff' },

      // Comments
      { token: 'comment', foreground: '#8b949e', fontStyle: 'italic' },

      // Numbers
      { token: 'number', foreground: '#79c0ff' },

      // Functions
      { token: 'entity.name.function', foreground: '#d2a8ff' },
      { token: 'support.function', foreground: '#d2a8ff' },

      // Variables and properties
      { token: 'variable', foreground: '#ffa657' },
      { token: 'variable.other', foreground: '#f0f6fc' },

      // Types and classes
      { token: 'entity.name.type', foreground: '#d2a8ff' },
      { token: 'entity.name.class', foreground: '#d2a8ff' },

      // Operators
      { token: 'keyword.operator', foreground: '#ff7b72' },

      // Punctuation
      { token: 'punctuation', foreground: '#f0f6fc' },

      // HTML/JSX tags
      { token: 'entity.name.tag', foreground: '#7ee787' },
      { token: 'entity.other.attribute-name', foreground: '#79c0ff' },

      // CSS properties
      { token: 'support.type.property-name', foreground: '#79c0ff' },

      // JSON keys
      { token: 'support.type.property-name.json', foreground: '#79c0ff' },
    ],
    colors: {
      // Editor background - GitHub's dark theme
      'editor.background': '#0d1117',
      'editor.foreground': '#f0f6fc',

      // Line numbers
      'editorLineNumber.foreground': '#6e7681',
      'editorLineNumber.activeForeground': '#f0f6fc',

      // Current line highlighting
      'editor.lineHighlightBackground': '#161b22',
      'editor.lineHighlightBorder': '#0d1117',

      // Selection colors
      'editor.selectionBackground': '#264f7840',
      'editor.selectionHighlightBackground': '#264f7820',

      // Cursor
      'editorCursor.foreground': '#79c0ff',

      // Scrollbars
      'scrollbarSlider.background': '#30363d88',
      'scrollbarSlider.hoverBackground': '#30363daa',
      'scrollbarSlider.activeBackground': '#30363dcc',

      // Borders
      'editorWidget.border': '#30363d',

      // Find/replace widget
      'editorWidget.background': '#161b22',
      'input.background': '#0d1117',
      'input.border': '#30363d',

      // Bracket matching
      'editorBracketMatch.background': '#3fb95040',
      'editorBracketMatch.border': '#3fb950',
    },
  });
};

const getLanguageFromPath = (filePath: string): string => {
  const extension = filePath.split('.').pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    php: 'php',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    json: 'json',
    xml: 'xml',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
    sql: 'sql',
    dockerfile: 'dockerfile',
  };

  return languageMap[extension || ''] || 'plaintext';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 bytes';
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getLineCount = (content: string): number => {
  return content.split('\n').length;
};

const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
};

export default function Editor({ shareId, selectedFile }: CodeEditorProps) {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkTheme = useTheme();

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const isCombo = e.ctrlKey || e.metaKey;
    const code = e.keyCode;
    // Block: C(67), X(88), S(83), P(80), A(65)
    if (isCombo && (code === 67 || code === 88 || code === 83 || code === 80 || code === 65)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleClipboard = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const onEditorMount = useCallback(
    (editor: MonacoEditorNS.IStandaloneCodeEditor, monacoInstance: Monaco) => {
      editor.onKeyDown((evt: IKeyboardEvent) => {
        const isCombo = evt.ctrlKey || evt.metaKey;
        const code = evt.keyCode;
        if (
          isCombo &&
          (code === monacoInstance.KeyCode.KeyC ||
            code === monacoInstance.KeyCode.KeyX ||
            code === monacoInstance.KeyCode.KeyS ||
            code === monacoInstance.KeyCode.KeyP ||
            code === monacoInstance.KeyCode.KeyA)
        ) {
          evt.preventDefault();
          evt.stopPropagation();
        }
      });
    },
    []
  );

  const fetchFileContent = useCallback(
    async (filePath: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/share/${shareId}/file?filePath=${encodeURIComponent(filePath)}`,
          { credentials: 'include' }
        );

        if (response.status === 403) {
          throw new Error('Access expired or limit reached');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const data = await response.json();

        // Decode base64 content if needed
        let decodedContent = data.content;
        if (data.encoding === 'base64') {
          try {
            decodedContent = decodeURIComponent(escape(atob(data.content)));
          } catch {
            // Fallback for simple ASCII content
            decodedContent = atob(data.content);
          }
        }

        setFileContent({
          ...data,
          content: decodedContent,
        });
      } catch (err) {
        console.error('Error fetching file content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [shareId]
  );

  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    } else {
      setFileContent(null);
      setError(null);
    }
  }, [selectedFile, fetchFileContent]);

  // No file selected state - GitHub style
  if (!selectedFile) {
    return (
      <div className="bg-bg-default flex h-full flex-col">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <File className="text-fg-muted mx-auto mb-4 h-16 w-16 opacity-30" />
            <h3 className="text-fg-default mb-2 text-lg font-normal">No file selected</h3>
            <p className="text-fg-muted text-sm">
              Choose a file from the repository tree to view its contents
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state - GitHub style
  if (isLoading) {
    return (
      <div className="bg-bg-default flex h-full flex-col">
        {/* File header placeholder */}
        <div className="border-border-default bg-bg-muted border-b px-4 py-3">
          <div className="flex items-center">
            <File className="text-fg-muted mr-2 h-4 w-4" />
            <span className="text-fg-default text-sm font-medium">
              {selectedFile.split('/').pop()}
            </span>
          </div>
        </div>

        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Loader2 className="text-fg-accent mx-auto mb-4 h-8 w-8 animate-spin" />
            <p className="text-fg-muted text-sm">Loading file content...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - GitHub style
  if (error) {
    return (
      <div className="bg-bg-default flex h-full flex-col">
        <div className="border-border-default bg-bg-muted border-b px-4 py-3">
          <div className="flex items-center">
            <File className="text-fg-danger mr-2 h-4 w-4" />
            <span className="text-fg-default text-sm font-medium">
              {selectedFile.split('/').pop()}
            </span>
          </div>
        </div>

        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <File className="text-fg-danger mx-auto mb-4 h-16 w-16 opacity-50" />
            <h3 className="text-fg-danger mb-2 text-lg font-medium">Error loading file</h3>
            <p className="text-fg-muted text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const language = getLanguageFromPath(selectedFile);
  const lineCount = fileContent?.content ? getLineCount(fileContent.content) : 0;

  return (
    <div
      className="bg-bg-default flex h-full flex-col select-none"
      onContextMenu={handleContextMenu}
      onCopy={handleClipboard}
      onCut={handleClipboard}
      onKeyDown={handleContainerKeyDown}
    >
      {/* GitHub-style file header */}
      <div className="border-border-default bg-bg-default border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <File className="text-fg-muted mr-2 h-4 w-4" />
            <span className="text-fg-default text-sm font-medium">{fileContent?.name}</span>
          </div>

          {/* GitHub-style file stats */}
          <div className="text-fg-muted flex items-center space-x-4 text-xs">
            <span>{lineCount} lines</span>
            {fileContent?.size && <span>{formatFileSize(fileContent.size)}</span>}
            <span className="bg-bg-muted text-fg-default rounded px-2 py-1 font-mono text-xs">
              {language}
            </span>
          </div>
        </div>
      </div>

      {/* Monaco Editor with GitHub theme */}
      <div className="relative flex-1">
        <MonacoEditor
          height="100%"
          language={language}
          value={fileContent?.content || ''}
          theme={isDarkTheme ? 'github-dark' : 'github-light'}
          beforeMount={defineGitHubThemes}
          onMount={onEditorMount}
          options={{
            // GitHub-like editor options
            readOnly: true,
            contextmenu: false,
            // Font settings - GitHub uses system fonts
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: 14,
            lineHeight: 20,

            // Line numbers - GitHub style
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            lineDecorationsWidth: 10,

            // Layout
            minimap: { enabled: false }, // GitHub doesn't show minimap
            automaticLayout: true,
            wordWrap: 'off', // GitHub has horizontal scroll

            // Selection and highlighting
            renderLineHighlight: 'line',
            selectionHighlight: true,
            occurrencesHighlight: 'singleFile',

            // Scrolling
            scrollBeyondLastLine: false,
            smoothScrolling: true,

            // GitHub doesn't show these
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,

            // Scrollbars - minimal like GitHub
            scrollbar: {
              verticalScrollbarSize: 14,
              horizontalScrollbarSize: 14,
              vertical: 'visible',
              horizontal: 'visible',
            },

            // Bracket matching
            bracketPairColorization: {
              enabled: true,
            },

            showFoldingControls: 'always',
            foldingHighlight: false,

            // Whitespace
            renderWhitespace: 'none',
          }}
          loading={
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          }
        />
      </div>
    </div>
  );
}
