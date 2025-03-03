interface UserDocument {
  id: number;
  title: string;
  tagPath: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  lastModifiedBy: number | null;
  documentContents: UserDocumentContent[];
}
