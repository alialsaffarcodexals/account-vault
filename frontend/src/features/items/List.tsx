import { useEffect, useMemo, useState } from 'react';
import { list, create, Item } from './api';
import Card from './Card';
import DrawerForm from './DrawerForm';
import { toast } from 'sonner';
import { bindHotkeys } from '../../lib/hotkeys';

export default function List() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [showNew, setShowNew] = useState(false);

  const load = async () => {
    const res = await list({ q, page: 1, pageSize: 50 });
    setItems(res.items);
    setTotal(res.total);
  };

  useEffect(() => { load().catch(()=>toast.error('Failed to load')); }, [q]);

  useEffect(()=>bindHotkeys({
    '/': ()=>document.getElementById('search')?.focus(),
    'n': ()=>setShowNew(true)
  }), []);

  return (
    <div className="max-w-5xl mx-auto space-y-3">
      <div className="flex items-center gap-2">
        <input id="search" placeholder="Search…" value={q} onChange={(e)=>setQ(e.target.value)} className="w-full rounded-md border px-3 py-2" />
        <button className="rounded-md border px-3 py-2" onClick={()=>setShowNew(true)}>New</button>
      </div>
      <div className="text-sm opacity-70">{total} items</div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(it => <Card key={it.id} item={it} />)}
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">New item</div>
              <button onClick={()=>setShowNew(false)} className="text-sm opacity-70 hover:opacity-100">Close</button>
            </div>
            <DrawerForm onSubmit={async (vals)=>{
              try {
                await create(vals);
                toast.success('Saved');
                setShowNew(false);
                await load();
              } catch(e:any) {
                toast.error(e.message || 'Save failed');
              }
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
