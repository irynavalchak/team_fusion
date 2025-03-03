interface UserDocumentModel {
  id: number;
  title: string;
  tag_path: string;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  last_modified_by: number | null;
  document_contents: UserDocumentContentModel[];
}
