// This file will be used for global state management
// You can implement a state management solution like Redux, Zustand, or Context API

// Example using React Context API
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/models/User';

type AppState = {
  user: User | null;
  location: string;
  setUser: (user: User | null) => void;
  setLocation: (location: string) => void;
};

const initialState: AppState = {
  user: null,
  location: 'San Francisco, CA',
  setUser: () => {},
  setLocation: () => {},
};

const AppContext = createContext<AppState>(initialState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState('San Francisco, CA');

  return (
    <AppContext.Provider value={{ user, location, setUser, setLocation }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}
