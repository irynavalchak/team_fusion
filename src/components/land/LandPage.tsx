import {getDirectoryStructure} from '../../utils/fileSystem';
import LandManager from './components/land_manager/LandManager';

export default async function Home() {
  const structure = await getDirectoryStructure('./public');

  return <LandManager initialStructure={structure} />;
}
