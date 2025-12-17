import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const registerSchema = z.object( {
  name: z.string().min( 2, 'Name must be at least 2 characters' ),
  email: z.string().email( 'Invalid email address' ),
  password: z.string().min( 6, 'Password must be at least 6 characters' ),
  confirmPassword: z.string(),
} ).refine( ( data ) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: [ 'confirmPassword' ],
} );

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [ showPassword, setShowPassword ] = useState( false );
  const [ isLoading, setIsLoading ] = useState( false );
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterFormData>( {
    resolver: zodResolver( registerSchema ),
  } );

  const onSubmit = async ( data: RegisterFormData ) => {
    setIsLoading( true );
    try {
      await axios.post( `${ import.meta.env.VITE_API_URL }/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
      }, { withCredentials: true } );
      toast( { title: 'Account Created!', description: 'Welcome to Heritage Museum.' } );
      navigate( '/', { replace: true } );
    } catch ( err: any ) {
      toast( {
        title: 'Registration Failed',
        description: err.response?.data?.error || 'Could not create account. Please try again.',
        variant: 'destructive',
      } );
    } finally {
      setIsLoading( false );
    }
  };

  return (
    <Layout showFooter={ false }>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
        <motion.div initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } className="w-full max-w-md">
          <div className="bg-card p-8 rounded-2xl shadow-card">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join Heritage Museum today</p>
            </div>
            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...registerField( 'name' ) } id="name" placeholder="John Doe" className="pl-10" />
                </div>
                { errors.name && <p className="text-destructive text-sm mt-1">{ errors.name.message }</p> }
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...registerField( 'email' ) } id="email" type="email" placeholder="you@example.com" className="pl-10" />
                </div>
                { errors.email && <p className="text-destructive text-sm mt-1">{ errors.email.message }</p> }
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...registerField( 'password' ) } id="password" type={ showPassword ? 'text' : 'password' } placeholder="••••••••" className="pl-10 pr-10" />
                  <button type="button" onClick={ () => setShowPassword( !showPassword ) } className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    { showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" /> }
                  </button>
                </div>
                { errors.password && <p className="text-destructive text-sm mt-1">{ errors.password.message }</p> }
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...registerField( 'confirmPassword' ) } id="confirmPassword" type={ showPassword ? 'text' : 'password' } placeholder="••••••••" className="pl-10" />
                </div>
                { errors.confirmPassword && <p className="text-destructive text-sm mt-1">{ errors.confirmPassword.message }</p> }
              </div>
              <Button type="submit" className="w-full btn-gold" disabled={ isLoading }>
                { isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account...</> : 'Create Account' }
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Register;
