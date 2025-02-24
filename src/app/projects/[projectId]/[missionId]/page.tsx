'use client';

import {useParams} from 'next/navigation';
import MissionPage from 'components/mission/MissionPage';

export default function MissionPageWrapper() {
  const params = useParams();
  const projectId = params.projectId;
  const missionId = params.missionId;

  if (!projectId || !missionId) return <p>Mission not found</p>;

  return <MissionPage missionId={missionId as string} projectId={projectId as string} />;
}
