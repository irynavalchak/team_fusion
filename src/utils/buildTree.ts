interface TreeNode {
  [key: string]: TreeNode | UserDocument;
}

export const buildTree = (docs: UserDocument[]): TreeNode => {
  const tree: TreeNode = {};
  docs?.forEach(doc => {
    const parts = doc.tagPath ? doc.tagPath.split('/') : [];
    let currentLevel: TreeNode = tree;
    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = {};
      }
      if (index === parts.length - 1) {
        (currentLevel[part] as TreeNode)[doc.title] = doc;
      } else {
        currentLevel = currentLevel[part] as TreeNode;
      }
    });
    if (parts.length === 0) {
      tree[doc.title] = doc;
    }
  });
  return tree;
};
