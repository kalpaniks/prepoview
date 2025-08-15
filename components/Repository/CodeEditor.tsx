'use client';

import { useEffect, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { File, Loader2 } from 'lucide-react';

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

// Get language from file extension for Monaco Editor
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

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function CodeEditor({ shareId, selectedFile }: CodeEditorProps) {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFileContent = useCallback(
    async (filePath: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/share/${shareId}/file?filePath=${encodeURIComponent(filePath)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const data = await response.json();
        setFileContent(data);
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

  // No file selected state
  if (!selectedFile) {
    return (
      <div className="flex h-full flex-col bg-gray-50">
        <div className="flex h-full items-center justify-center text-gray-500">
          <div className="text-center">
            <File className="mx-auto mb-4 h-16 w-16 opacity-40" />
            <h3 className="mb-2 text-lg font-medium">No file selected</h3>
            <p className="text-sm">Choose a file from the repository tree to view its contents</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center">
            <File className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{selectedFile}</span>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading file content...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center">
            <File className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">{selectedFile}</span>
          </div>
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-red-600">
            <File className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <h3 className="mb-2 text-lg font-medium">Error loading file</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // File content display
  const language = getLanguageFromPath(selectedFile);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* File header - GitHub style */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <File className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">{fileContent?.name}</span>
          </div>
          {fileContent?.size && (
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{formatFileSize(fileContent.size)}</span>
              <span className="capitalize">{language}</span>
            </div>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={fileContent?.content || ''}
          theme="light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 4,
            renderLineHighlight: 'line',
            selectionHighlight: false,
            occurrencesHighlight: false,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              vertical: 'visible',
              horizontal: 'visible',
              verticalSliderSize: 12,
              horizontalSliderSize: 12,
            },
            // GitHub-like colors and styling
            bracketPairColorization: {
              enabled: true,
            },
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
