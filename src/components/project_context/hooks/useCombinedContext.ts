import {useMemo} from 'react';
import {ProjectContextBlock} from 'typings/projectContext';
import {PROJECT_CONTEXT_PLACEHOLDERS} from 'constants/projectContext';

interface UseCombinedContextOptions {
  includePrompts?: boolean;
}

const useCombinedContext = (contextBlocks: ProjectContextBlock[] | null, options: UseCombinedContextOptions = {}) => {
  const {includePrompts = false} = options;

  const combinedContext = useMemo(() => {
    if (!contextBlocks || contextBlocks.length === 0) {
      return '';
    }

    // Filter blocks based on options
    const filteredBlocks = contextBlocks.filter(block => {
      // If includePrompts is false, exclude prompt blocks
      if (!includePrompts && block.isPrompt) {
        return false;
      }
      return true;
    });

    return filteredBlocks
      .map(block => {
        const header = `# ${block.title || block.path}`;
        const pathInfo = block.path ? `**Path:** ${block.path}` : '';
        const tagsInfo = block.tags && block.tags.length > 0 ? `**Tags:** ${block.tags.join(', ')}` : '';
        const metadata = [pathInfo, tagsInfo].filter(Boolean).join('\n');
        const content = block.content || '';

        return [header, metadata, '', content].filter(Boolean).join('\n');
      })
      .join('\n\n---\n\n');
  }, [contextBlocks, includePrompts]);

  const processPromptTemplate = useMemo(() => {
    return (promptContent: string, projectContext: string) => {
      const contextPlaceholder = PROJECT_CONTEXT_PLACEHOLDERS.PROJECT_CONTEXT;

      if (promptContent.includes(contextPlaceholder)) {
        // Replace placeholder with project context
        return promptContent.replace(contextPlaceholder, projectContext);
      } else {
        // Append project context at the end
        return `${promptContent}\n\n\`\`\`\n${projectContext}\n\`\`\``;
      }
    };
  }, []);

  return {
    combinedContext,
    processPromptTemplate
  };
};

export default useCombinedContext;
