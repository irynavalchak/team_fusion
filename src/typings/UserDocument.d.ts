interface UserDocument {
  id: string;
  title: string;
  tagPath: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  contents: UserDocumentContent[];
}
