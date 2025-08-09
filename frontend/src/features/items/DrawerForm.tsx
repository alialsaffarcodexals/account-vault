import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountItemSchema, AccountItemForm } from '../../lib/schemas';
import { PhoneInputBH } from '../../components/PhoneInputBH';
import { generatePassword } from '../../components/PasswordGenerator';

export default function DrawerForm({ onSubmit }:{ onSubmit: (form: AccountItemForm)=>void }) {
  const { register, control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<AccountItemForm>({
    resolver: zodResolver(accountItemSchema),
    defaultValues: { tags: [], custom: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'custom' });

  const submit = handleSubmit(async (vals) => onSubmit(vals));
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Category</label>
          <input className="w-full rounded-md border px-3 py-2" {...register('category')} />
          {errors.category && <div className="text-xs text-red-500">{errors.category.message}</div>}
        </div>
        <div>
          <label className="text-sm">Display name</label>
          <input className="w-full rounded-md border px-3 py-2" {...register('displayName')} />
        </div>
        <div>
          <label className="text-sm">Username</label>
          <input className="w-full rounded-md border px-3 py-2" {...register('username')} />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <div className="flex gap-2">
            <input className="w-full rounded-md border px-3 py-2" {...register('password')} />
            <button type="button" className="rounded-md border px-2" onClick={()=>setValue('password', generatePassword({ length: 16, digits: true, symbols: true, avoidAmbiguous: true }))}>Generate</button>
          </div>
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input className="w-full rounded-md border px-3 py-2" {...register('email')} />
        </div>
        <div>
          <label className="text-sm">URL</label>
          <input className="w-full rounded-md border px-3 py-2" {...register('url')} />
        </div>
        <div>
          <label className="text-sm">Tags (comma separated)</label>
          <input className="w-full rounded-md border px-3 py-2" onChange={(e)=>setValue('tags', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
        </div>
        <div>
          <label className="text-sm">Bahraini Phone</label>
          <PhoneInputBH value={undefined} onChange={(v)=>setValue('phoneBH', v)} />
        </div>
      </div>

      <div>
        <label className="text-sm">Notes</label>
        <textarea className="w-full rounded-md border px-3 py-2" rows={3} {...register('notes')} />
      </div>

      <div>
        <div className="font-medium mb-1">Custom fields</div>
        {fields.map((f, i) => (
          <div className="flex gap-2 mb-2" key={f.id}>
            <input placeholder="Key" className="rounded-md border px-3 py-2" {...register(`custom.${i}.key` as const)} />
            <input placeholder="Value" className="rounded-md border px-3 py-2" {...register(`custom.${i}.value` as const)} />
            <button type="button" className="px-2 rounded-md border" onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="rounded-md border px-3 py-2" onClick={() => append({ key: '', value: '' })}>Add field</button>
      </div>

      <div className="pt-2">
        <button disabled={isSubmitting} className="btn-accent rounded-md px-4 py-2">Save</button>
      </div>
    </form>
  );
}
