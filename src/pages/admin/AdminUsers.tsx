import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Shield, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  _id: string;
  userName: string;
  email: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  createdAt?: string;
}

const AdminUsers = () => {
  const [ users, setUsers ] = useState<User[]>( [] );
  const [ search, setSearch ] = useState( '' );
  const [ isLoading, setIsLoading ] = useState( true );
  const { toast } = useToast();

  useEffect( () => {
    fetchUsers();
  }, [] );

  const fetchUsers = async () => {
    setIsLoading( true );
    try {
      const response = await adminAPI.getUsers();
      // adminAPI.getUsers returns array of users
      setUsers( response.data || [] );
    } catch ( error ) {
      console.error( 'Fetch users error', error );
      const msg = error?.response?.data?.message || 'Failed to fetch users';
      toast( { title: 'Error', description: msg, variant: 'destructive' } );
    } finally {
      setIsLoading( false );
    }
  };

  const handleToggleRole = async ( user: User ) => {
    if ( user.role === 'admin' ) {
      toast( { title: 'Info', description: 'Cannot demote admin via this action.' } );
      return;
    }
    try {
      await adminAPI.updateUserToAdmin( user._id );
      toast( { title: 'Role Updated', description: `${ user.userName } is now admin` } );
      fetchUsers();
    } catch ( error ) {
      console.error( 'Update role error', error );
      const msg = error?.response?.data?.message || 'Could not update role';
      toast( { title: 'Error', description: msg, variant: 'destructive' } );
    }
  };

  const handleDeleteUser = async ( user: User ) => {
    if ( !confirm( `Delete user ${ user.userName }?` ) ) return;
    try {
      await adminAPI.deleteUser( user._id );
      toast( { title: 'User Deleted' } );
      fetchUsers();
    } catch ( error ) {
      console.error( 'Delete user error', error );
      const msg = error?.response?.data?.message || 'Could not delete user';
      toast( { title: 'Error', description: msg, variant: 'destructive' } );
    }
  };

  const filteredUsers = users.filter( ( u ) =>
    u.userName.toLowerCase().includes( search.toLowerCase() ) ||
    u.email.toLowerCase().includes( search.toLowerCase() )
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={ search }
            onChange={ ( e ) => setSearch( e.target.value ) }
            className="pl-10"
          />
        </div>
      </div>

      { isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">User</th>
                  <th className="text-left px-6 py-4 font-medium">Role</th>
                  <th className="text-left px-6 py-4 font-medium hidden md:table-cell">Status</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                { filteredUsers.map( ( user, i ) => (
                  <motion.tr
                    key={ user._id }
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    transition={ { delay: i * 0.05 } }
                    className="border-t border-border"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-accent font-semibold">{ user.userName.charAt( 0 ) }</span>
                        </div>
                        <div>
                          <p className="font-medium">{ user.userName }</p>
                          <p className="text-sm text-muted-foreground">{ user.email }</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={ `px-2 py-1 text-xs font-medium rounded-full ${ user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }` }>
                        { user.role }
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={ `px-2 py-1 text-xs font-medium rounded-full ${ user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }` }>
                        { user.isActive !== false ? 'Active' : 'Inactive' }
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={ () => handleToggleRole( user ) }
                          title={ user.role === 'admin' ? 'Remove admin' : 'Make admin' }
                        >
                          <Shield className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={ () => handleDeleteUser( user ) }
                          title="Delete user"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }
    </div>
  );
};

export default AdminUsers;
