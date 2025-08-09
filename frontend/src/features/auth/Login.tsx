import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PasswordField from '../../components/PasswordField';
import { login } from './useAuth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export default function Login({ onLoggedIn }:{ onLoggedIn: ()=>void }) {
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<{username:string;password:string}>({
    resolver: zodResolver(schema)
  });
  const onSubmit = handleSubmit(async (vals) => {
    try {
      await login(vals.username, vals.password);
      toast.success('Welcome back!');
      onLoggedIn();
    } catch (e:any) {
      toast.error(e.message || 'Login failed');
    }
  });
  return (
    <div className="grid place-items-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="backdrop-blur-xl bg-white/60 dark:bg-black/30 rounded-2xl p-6 shadow-xl w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Username</label>
            <input className="w-full rounded-md border px-3 py-2" {...reg('username')} />
            {errors.username && <div className="text-red-500 text-xs">{errors.username.message}</div>}
          </div>
          <div>
            <label className="text-sm">Password</label>
            <PasswordField {...reg('password')} />
            {errors.password && <div className="text-red-500 text-xs">{errors.password.message}</div>}
          </div>
          <button disabled={isSubmitting} className="btn-accent w-full rounded-md py-2 font-medium">{isSubmitting ? '…' : 'Login'}</button>
        </form>
        <div className="text-sm mt-4 opacity-80">
          New here? <a href="#" onClick={() => location.assign('/register') } className="underline">Create an account</a>
        </div>
      </motion.div>
    </div>
  );
}
