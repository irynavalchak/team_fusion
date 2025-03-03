interface TreeNode {
  [key: string]: TreeNode | UserDocument;
}

export const documentPath = (documentId: number, tree: TreeNode, path: string[] = []): string[] | null => {
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'object' && 'id' in value && value.id === documentId) {
      return [...path, key];
    }
    if (typeof value === 'object' && !('id' in value)) {
      const result = documentPath(documentId, value as TreeNode, [...path, key]);
      if (result) return result;
    }
  }
  return null;
};
