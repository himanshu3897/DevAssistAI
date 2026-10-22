import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Product = { id: number; name: string; sku: string; quantity: number; price: number };
const API = 'http://localhost:5082/api/products';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('0');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function load(term = search) {
    setBusy(true);
    try {
      const response = await fetch(`${API}?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Could not load inventory.');
      setProducts(await response.json() as Product[]);
      setMessage('');
    } catch {
      setMessage('Cannot connect to API. Start StockDesk.Api on port 5082.');
    } finally { setBusy(false); }
  }
  useEffect(() => { void load(''); }, []);
  useEffect(() => {
    const handle = window.setTimeout(() => { void load(search); }, 250);
    return () => window.clearTimeout(handle);
  }, [search]);

  const lowStock = useMemo(() => products.filter(p => p.quantity <= 5).length, [products]);
  const totalUnits = useMemo(() => products.reduce((sum, p) => sum + p.quantity, 0), [products]);

  async function addProduct(event: React.FormEvent) {
    event.preventDefault();
    const payload = { name: name.trim(), sku: sku.trim(), quantity: Number(quantity), price: Number(price) };
    if (!payload.name || !payload.sku || payload.quantity < 0 || payload.price < 0) {
      setMessage('Enter a name, SKU, and non-negative quantity and price.'); return;
    }
    try {
      const response = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? 'Could not add product.');
      }
      setName(''); setSku(''); setQuantity('1'); setPrice('0'); setMessage('');
      await load(search);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not add product.'); }
  }
  async function removeProduct(id: number) {
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete product.');
      await load(search);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not delete product.'); }
  }

  return <main className="shell">
    <header><div><p className="eyebrow">OPERATIONS / INVENTORY</p><h1>StockDesk</h1><p className="sub">A clearer view of what is on your shelves.</p></div><span className="live">API DEMO</span></header>
    <section className="metrics">
      <article><span>Products shown</span><strong>{products.length}</strong></article>
      <article><span>Total units shown</span><strong>{totalUnits}</strong></article>
      <article><span>Low stock (≤ 5)</span><strong>{lowStock}</strong></article>
    </section>
    <section className="panel">
      <div className="toolbar"><h2>Inventory</h2><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or SKU…" aria-label="Search inventory" /></div>
      <form className="add-form" onSubmit={addProduct}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" required maxLength={100}/>
        <input value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU" required maxLength={40}/>
        <input type="number" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} aria-label="Quantity" required/>
        <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} aria-label="Price" required/>
        <button disabled={busy} type="submit">Add product</button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="table-wrap"><table><thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>{products.map(p => <tr key={p.id}><td className="product">{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td><td>{p.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td><td><span className={p.quantity <= 5 ? 'badge low' : 'badge ok'}>{p.quantity === 0 ? 'Out of stock' : p.quantity <= 5 ? 'Low stock' : 'In stock'}</span></td><td><button className="remove" type="button" onClick={() => void removeProduct(p.id)}>Delete</button></td></tr>)}</tbody>
      </table></div>
      {!products.length && !busy && <p className="empty">No products match this search.</p>}
    </section>
    <footer>React + TypeScript · ASP.NET Core 8 · Demo data only</footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
