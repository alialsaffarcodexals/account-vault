import { useForm } from 'react-hook-form';
import { zodResolver } from '../../lib/zodResolver';
import { z } from 'zod';
import PasswordField from '../../components/PasswordField';
import { register as registerApi } from './useAuth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  confirm: z.string().min(8)
}).refine((d)=>d.password===d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function Register() {
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<{username:string;password:string;confirm:string}>({
    resolver: zodResolver(schema)
  });
  const onSubmit = handleSubmit(async (vals) => {
    try {
      await registerApi(vals.username, vals.password);
      toast.success('Account created. You are now logged in.');
      location.assign('/');
    } catch (e:any) {
      toast.error(e.message || 'Registration failed');
    }
  });
  return (
    <div className="grid place-items-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="backdrop-blur-xl bg-white/60 dark:bg-black/30 rounded-2xl p-6 shadow-xl w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Register</h1>
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
          <div>
            <label className="text-sm">Confirm password</label>
            <PasswordField {...reg('confirm')} />
            {errors.confirm && <div className="text-red-500 text-xs">{errors.confirm.message}</div>}
          </div>
          <button disabled={isSubmitting} className="btn-accent w-full rounded-md py-2 font-medium">{isSubmitting ? '…' : 'Register'}</button>
        </form>
      </motion.div>
    </div>
  );
}
