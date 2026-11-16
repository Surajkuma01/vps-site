import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialProjects, type Project } from '../data/projects';
import { initialServices, type ServiceItem } from '../data/services';
import { fetchRemoteProjects, syncProjectsToCloud } from '../config/spreadsheet';

const STORAGE_PROJECTS_KEY = 'dlam_infra_projects_v3';
const STORAGE_SERVICES_KEY = 'dlam_infra_services_v3';

interface SiteDataContextType {
  projects: Project[];
  services: ServiceItem[];
  isCloudSyncing: boolean;
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  resetDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  syncToCloudNow: (customProjects?: Project[]) => Promise<boolean>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading projects from localStorage', e);
    }
    return initialProjects;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SERVICES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading services from localStorage', e);
    }
    return initialServices;
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const isInitialMount = useRef(true);

  // Initial load: Fetch live synchronized projects from Google Sheet
  useEffect(() => {
    let active = true;
    fetchRemoteProjects().then((remoteProjects) => {
      if (active && remoteProjects && remoteProjects.length > 0) {
        setProjects(remoteProjects);
      }
    });
    return () => { active = false; };
  }, []);

  // Persist to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }

    // Auto-sync to cloud when changes occur (skip initial mount)
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      syncProjectsToCloud(projects).catch(() => {});
    }
  }, [projects]);

  // Persist to localStorage whenever services change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services to localStorage', e);
    }
  }, [services]);

  const syncToCloudNow = async (customProjects?: Project[]): Promise<boolean> => {
    setIsCloudSyncing(true);
    const toSync = customProjects || projects;
    const ok = await syncProjectsToCloud(toSync);
    setIsCloudSyncing(false);
    return ok;
  };

  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const newProject: Project = {
      ...projectData,
      id: nextId,
    };
    const updated = [newProject, ...projects];
    setProjects(updated);
    syncProjectsToCloud(updated).catch(() => {});
    return newProject;
  };

  const updateProject = (id: number, updatedFields: Partial<Project>) => {
    const updated = projects.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    setProjects(updated);
    syncProjectsToCloud(updated).catch(() => {});
  };

  const deleteProject = (id: number) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    syncProjectsToCloud(updated).catch(() => {});
  };

  const updateService = (id: string, updatedFields: Partial<ServiceItem>) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const resetDefaults = () => {
    setProjects(initialProjects);
    setServices(initialServices);
    localStorage.removeItem(STORAGE_PROJECTS_KEY);
    localStorage.removeItem(STORAGE_SERVICES_KEY);
    syncProjectsToCloud(initialProjects).catch(() => {});
  };

  const exportDataJSON = () => {
    return JSON.stringify({ projects, services, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
        syncProjectsToCloud(data.projects).catch(() => {});
      }
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON data', e);
      return false;
    }
  };

  return (
    <SiteDataContext.Provider
      value={{
        projects,
        services,
        isCloudSyncing,
        addProject,
        updateProject,
        deleteProject,
        updateService,
        resetDefaults,
        exportDataJSON,
        importDataJSON,
        syncToCloudNow,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
