import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface ProjectsState {
  projects: Project[];
  selectedMission: Mission | null;
  userData: UserData | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedMission: null,
  userData: null
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
    },
    setSelectedMission: (state, action: PayloadAction<Mission | null>) => {
      state.selectedMission = action.payload;
    },
    updateProjectName: (state, action: PayloadAction<{projectId: string; name: string}>) => {
      const {projectId, name} = action.payload;
      const project = state.projects.find(proj => proj.id === projectId);
      if (project) {
        project.name = name;
      }
    },

    updateMission: (
      state,
      action: PayloadAction<{
        projectId: string;
        missionId: string;
        name: string;
      }>
    ) => {
      const {projectId, missionId, name} = action.payload;
      const project = state.projects.find(proj => proj.id === projectId);
      if (project) {
        const mission = project.missions.find(mis => mis.id === missionId);
        if (mission) {
          mission.name = name;
        }
      }
    },

    addMission: (
      state,
      action: PayloadAction<{
        projectId: string;
        name: string;
      }>
    ) => {
      const {projectId, name} = action.payload;
      const project = state.projects.find(proj => proj.id === projectId);
      if (project) {
        const newMission: Mission = {
          id: Date.now().toString(),
          name,
          status: 'todo',
          createdAt: Date.now().toString(),
          tasks: []
        };
        project.missions.push(newMission);
      }
    },

    deleteMission: (
      state,
      action: PayloadAction<{
        projectId: string;
        missionId: string;
      }>
    ) => {
      const {projectId, missionId} = action.payload;
      const project = state.projects.find(proj => proj.id === projectId);
      if (project) {
        project.missions = project.missions.filter(mis => mis.id !== missionId);
      }
    },

    reorderMissions: (
      state,
      action: PayloadAction<{
        projectId: string;
        startIndex: number;
        endIndex: number;
      }>
    ) => {
      const {projectId, startIndex, endIndex} = action.payload;
      const project = state.projects.find(proj => proj.id === projectId);
      if (project) {
        const [removed] = project.missions.splice(startIndex, 1);
        project.missions.splice(endIndex, 0, removed);
      }
    },

    moveMission: (
      state,
      action: PayloadAction<{
        sourceProjectId: string;
        destinationProjectId: string;
        startIndex: number;
        endIndex: number;
      }>
    ) => {
      const {sourceProjectId, destinationProjectId, startIndex, endIndex} = action.payload;
      const sourceProject = state.projects.find(proj => proj.id === sourceProjectId);
      const destinationProject = state.projects.find(proj => proj.id === destinationProjectId);

      if (sourceProject && destinationProject) {
        const [removed] = sourceProject.missions.splice(startIndex, 1);
        destinationProject.missions.splice(endIndex, 0, removed);
      }
    },

    updateTask: (state, action: PayloadAction<{taskId: string; title: string; description: string}>) => {
      if (state.selectedMission) {
        const {taskId, title, description} = action.payload;
        const task = state.selectedMission.tasks.find(t => t.id === taskId);
        if (task) {
          task.title = title;
          task.description = description;
        }
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      if (state.selectedMission) {
        const taskId = action.payload;
        state.selectedMission.tasks = state.selectedMission.tasks.filter(t => t.id !== taskId);
      }
    }
  }
});

export const {
  setProjects,
  setUserData,
  setSelectedMission,
  updateProjectName,
  updateMission,
  updateTask,
  addMission,
  deleteMission,
  deleteTask,
  reorderMissions,
  moveMission
} = projectsSlice.actions;

export default projectsSlice.reducer;
