import {getLandDirectoryStructure} from '../../utils/fileSystem';
import LandManager from './components/land_manager/LandManager';

export default async function Home() {
  const structure = await getLandDirectoryStructure('./public');

  return <LandManager initialStructure={structure} />;
}
