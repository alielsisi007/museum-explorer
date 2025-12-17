import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  userName: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: ( email: string, password: string ) => Promise<void>;
  register: ( username: string, email: string, password: string ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: ( userData: Partial<User> ) => void;
  getAllUsers: () => Promise<User[]>;
  deleteUser: ( userId: string ) => Promise<void>;
  promoteToAdmin: ( userId: string ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>( undefined );

export const AuthProvider: React.FC<{ children: ReactNode }> = ( { children } ) => {
  const [ user, setUser ] = useState<User | null>( null );
  const [ isLoading, setIsLoading ] = useState( true );

  // Initial auth check
  useEffect( () => {
    const initAuth = async () => {
      try {
        const response = await authAPI.getProfile(); // backend reads JWT from cookie
        setUser( response.data );
      } catch {
        setUser( null );
      } finally {
        setIsLoading( false );
      }
    };
    initAuth();
  }, [] );

  // Login
  const login = async ( email: string, password: string ) => {
    await authAPI.login( email, password ); // backend sets HttpOnly cookie
    const response = await authAPI.getProfile(); // get current user
    setUser( response.data );
  };

  // Register
  const register = async ( username: string, email: string, password: string ) => {
    await authAPI.register( { userName: username, email, password } );

    const response = await authAPI.getProfile();
    setUser( response.data );
  };

  // Logout
  const logout = async () => {
    // Optional: call backend logout endpoint if exists
    setUser( null );
  };

  // Update local user state
  const updateUser = ( userData: Partial<User> ) => {
    if ( user ) {
      setUser( { ...user, ...userData } );
    }
  };

  // Admin: get all users
  const getAllUsers = async () => {
    if ( !user || user.role !== 'admin' ) throw new Error( 'Admins only' );
    const response = await authAPI.getUsers();
    return response.data;
  };

  // Admin: delete user
  const deleteUser = async ( userId: string ) => {
    if ( !user || user.role !== 'admin' ) throw new Error( 'Admins only' );
    await authAPI.deleteUser( userId );
  };

  // Admin: promote user to admin
  const promoteToAdmin = async ( userId: string ) => {
    if ( !user || user.role !== 'admin' ) throw new Error( 'Admins only' );
    await authAPI.updateUserToAdmin( userId );
  };

  return (
    <AuthContext.Provider
      value={ {
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
        getAllUsers,
        deleteUser,
        promoteToAdmin,
      } }
    >
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext( AuthContext );
  if ( !context ) throw new Error( 'useAuth must be used within an AuthProvider' );
  return context;
};
