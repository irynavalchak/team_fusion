import {getDocumentsDirectoryStructure} from '../../utils/fileSystem';
import DocumentsManager from './components/documents_manager/DocumentsManager';

interface DirectoryStructure {
  [key: string]: DirectoryStructure | string[];
}

export default async function Home() {
  const structure: DirectoryStructure = await getDocumentsDirectoryStructure('./public/documents');

  return <DocumentsManager initialStructure={structure} />;
}
