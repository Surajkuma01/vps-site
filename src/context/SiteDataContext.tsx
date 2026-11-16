import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProjects, type Project } from '../data/projects';
import { initialServices, type ServiceItem } from '../data/services';

const STORAGE_PROJECTS_KEY = 'dlam_infra_projects_v3';
const STORAGE_SERVICES_KEY = 'dlam_infra_services_v3';

interface SiteDataContextType {
  projects: Project[];
  services: ServiceItem[];
  addProject: (project: Omit<Project, 'id'>) => Project;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  resetDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
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

  // Persist to localStorage whenever projects change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
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

  const addProject = (projectData: Omit<Project, 'id'>): Project => {
    const nextId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const newProject: Project = {
      ...projectData,
      id: nextId,
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: number, updatedFields: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
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
  };

  const exportDataJSON = () => {
    return JSON.stringify({ projects, services, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
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
        addProject,
        updateProject,
        deleteProject,
        updateService,
        resetDefaults,
        exportDataJSON,
        importDataJSON,
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
