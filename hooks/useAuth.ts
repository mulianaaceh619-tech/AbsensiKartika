import { useAppContext } from '@/contexts/AppContext';

export function useAuth() {
  const { currentUser, login, logout } = useAppContext();
  return { currentUser, login, logout };
}
