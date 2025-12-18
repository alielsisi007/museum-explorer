import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';

const loginSchema = z.object( {
  email: z.string().email( 'Invalid email address' ),
  password: z.string().min( 6, 'Password must be at least 6 characters' ),
} );

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [ showPassword, setShowPassword ] = useState( false );
  const [ isLoading, setIsLoading ] = useState( false );
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = ( location.state as { from?: string } )?.from || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>( {
    resolver: zodResolver( loginSchema ),
  } );

  const onSubmit = async ( data: LoginFormData ) => {
    setIsLoading( true );
    try {
      await authAPI.login( data.email, data.password );
      toast( { title: 'Welcome back!', description: 'You have successfully logged in.' } );
      navigate( from, { replace: true } );
    } catch ( err: any ) {
      toast( {
        title: 'Login Failed',
        description: err.response?.data?.error || 'Invalid credentials. Please try again.',
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
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your Heritage Museum account</p>
            </div>
            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...register( 'email' ) } id="email" type="email" placeholder="you@example.com" className="pl-10" />
                </div>
                { errors.email && <p className="text-destructive text-sm mt-1">{ errors.email.message }</p> }
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input { ...register( 'password' ) } id="password" type={ showPassword ? 'text' : 'password' } placeholder="••••••••" className="pl-10 pr-10" />
                  <button type="button" onClick={ () => setShowPassword( !showPassword ) } className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    { showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" /> }
                  </button>
                </div>
                { errors.password && <p className="text-destructive text-sm mt-1">{ errors.password.message }</p> }
              </div>
              <Button type="submit" className="w-full btn-gold" disabled={ isLoading }>
                { isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In' }
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-accent font-medium hover:underline">Register</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
