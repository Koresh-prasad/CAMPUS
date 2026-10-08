'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Sliders,
  DollarSign,
  Layers,
  History,
  ShoppingBag,
  ExternalLink,
  X,
  Save,
  Check,
} from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Electrical' | 'Plumbing' | 'Wi-Fi & Network' | 'Hardware & Carpentry' | 'Sanitation' | 'Appliances';
  quantity: number;
  unit: string;
  minStock: number;
  storageLocation: {
    room: string;
    rack: string;
    shelf: string;
  };
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastRestocked: string;
}

export interface InventoryHistoryLog {
  id: string;
  partName: string;
  action: 'Added' | 'Issued' | 'Returned' | 'Transferred' | 'Damaged';
  quantity: number;
  staff: string;
  relatedTask?: string;
  date: string;
}

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Schneider 16A Single Pole C-Curve MCB Breaker',
    sku: 'ELE-MCB-16A',
    category: 'Electrical',
    quantity: 28,
    unit: 'Units',
    minStock: 12,
    storageLocation: { room: 'Store Room 1', rack: 'Rack A', shelf: 'Shelf 2' },
    unitCost: 280,
    status: 'In Stock',
    lastRestocked: '02 Oct 2026',
  },
  {
    id: 'inv-2',
    name: 'Brass Washbasin Half-Inch Angle Cock Tap Cartridge',
    sku: 'PLM-TAP-15MM',
    category: 'Plumbing',
    quantity: 4,
    unit: 'Pieces',
    minStock: 10,
    storageLocation: { room: 'Store Room 2', rack: 'Rack P', shelf: 'Shelf 1' },
    unitCost: 195,
    status: 'Low Stock',
    lastRestocked: '18 Sep 2026',
  },
  {
    id: 'inv-3',
    name: 'CAT6 UTP Network Patch Cable RJ45 (3 Meters)',
    sku: 'NET-CAT6-3M',
    category: 'Wi-Fi & Network',
    quantity: 50,
    unit: 'Cables',
    minStock: 20,
    storageLocation: { room: 'IT Server Store', rack: 'Rack N', shelf: 'Shelf 4' },
    unitCost: 120,
    status: 'In Stock',
    lastRestocked: '25 Sep 2026',
  },
  {
    id: 'inv-4',
    name: 'Commercial RO Membrane 100 GPD Filter Element',
    sku: 'WTR-RO-100G',
    category: 'Plumbing',
    quantity: 2,
    unit: 'Filters',
    minStock: 6,
    storageLocation: { room: 'Water Plant Bay', rack: 'Rack W', shelf: 'Shelf 3' },
    unitCost: 850,
    status: 'Low Stock',
    lastRestocked: '15 Sep 2026',
  },
  {
    id: 'inv-5',
    name: 'Heavy Duty 4-Inch Stainless Steel Door Hinges',
    sku: 'CRP-HNG-4IN',
    category: 'Hardware & Carpentry',
    quantity: 0,
    unit: 'Pairs',
    minStock: 8,
    storageLocation: { room: 'Carpentry Shed', rack: 'Rack C', shelf: 'Shelf 1' },
    unitCost: 95,
    status: 'Out of Stock',
    lastRestocked: '01 Sep 2026',
  },
  {
    id: 'inv-6',
    name: 'Philips 20W LED Batten Tube Light (Cool Daylight)',
    sku: 'ELE-LED-20W',
    category: 'Electrical',
    quantity: 42,
    unit: 'Units',
    minStock: 15,
    storageLocation: { room: 'Store Room 1', rack: 'Rack A', shelf: 'Shelf 3' },
    unitCost: 260,
    status: 'In Stock',
    lastRestocked: '30 Sep 2026',
  },
];

export const INITIAL_INVENTORY_HISTORY: InventoryHistoryLog[] = [
  {
    id: 'log-1',
    partName: 'Brass Washbasin Angle Cock Tap Cartridge',
    action: 'Issued',
    quantity: 2,
    staff: 'Mahendra Singh (Lead Plumber)',
    relatedTask: 'TSK-2026-401 (Room A-204 Leak)',
    date: 'Today, 09:30 AM',
  },
  {
    id: 'log-2',
    partName: 'CAT6 UTP Network Patch Cable RJ45',
    action: 'Issued',
    quantity: 4,
    staff: 'Suresh Kumar (Network Tech)',
    relatedTask: 'AP-102 Replacement in Block B',
    date: 'Today, 08:45 AM',
  },
  {
    id: 'log-3',
    partName: 'Philips 20W LED Batten Tube Light',
    action: 'Added',
    quantity: 20,
    staff: 'Estate Storekeeper (Nalini Behera)',
    date: 'Yesterday, 04:00 PM',
  },
  {
    id: 'log-4',
    partName: 'Heavy Duty 4-Inch Stainless Steel Door Hinges',
    action: 'Damaged',
    quantity: 2,
    staff: 'Baidhar Rout (Carpenter)',
    date: 'Yesterday, 11:15 AM',
  },
];

export function InventoryManagementView() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [history, setHistory] = useState<InventoryHistoryLog[]>(INITIAL_INVENTORY_HISTORY);
  const [activeSubTab, setActiveSubTab] = useState<'ITEMS' | 'HISTORY' | 'PURCHASE'>('ITEMS');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedItemForIssue, setSelectedItemForIssue] = useState<InventoryItem | null>(null);
  const [issueQuantity, setIssueQuantity] = useState(1);
  const [issueStaff, setIssueStaff] = useState('Mahendra Singh');
  const [issueTask, setIssueTask] = useState('TSK-2026-401');

  // Add Item form state
  const [newName, setNewName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState<InventoryItem['category']>('Electrical');
  const [newQuantity, setNewQuantity] = useState(10);
  const [newUnit, setNewUnit] = useState('Units');
  const [newMinStock, setNewMinStock] = useState(5);
  const [newRoom, setNewRoom] = useState('Store Room 1');
  const [newRack, setNewRack] = useState('Rack A');
  const [newShelf, setNewShelf] = useState('Shelf 1');
  const [newUnitCost, setNewUnitCost] = useState(150);

  const categories: InventoryItem['category'][] = [
    'Electrical',
    'Plumbing',
    'Wi-Fi & Network',
    'Hardware & Carpentry',
    'Sanitation',
    'Appliances',
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSku) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newName,
      sku: newSku,
      category: newCategory,
      quantity: Number(newQuantity),
      unit: newUnit,
      minStock: Number(newMinStock),
      storageLocation: {
        room: newRoom,
        rack: newRack,
        shelf: newShelf,
      },
      unitCost: Number(newUnitCost),
      status: Number(newQuantity) === 0 ? 'Out of Stock' : Number(newQuantity) <= Number(newMinStock) ? 'Low Stock' : 'In Stock',
      lastRestocked: 'Today',
    };

    setItems((prev) => [newItem, ...prev]);

    // Log addition
    const newLog: InventoryHistoryLog = {
      id: `log-${Date.now()}`,
      partName: newItem.name,
      action: 'Added',
      quantity: newItem.quantity,
      staff: 'Admin Manager',
      date: 'Just now',
    };
    setHistory((prev) => [newLog, ...prev]);

    setShowAddModal(false);
    resetForm();
  };

  const handleIssueStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForIssue) return;

    const qty = Number(issueQuantity);
    if (qty > selectedItemForIssue.quantity) {
      alert('Cannot issue more than available quantity!');
      return;
    }

    const updatedQty = selectedItemForIssue.quantity - qty;
    const newStatus = updatedQty === 0 ? 'Out of Stock' : updatedQty <= selectedItemForIssue.minStock ? 'Low Stock' : 'In Stock';

    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemForIssue.id
          ? {
              ...item,
              quantity: updatedQty,
              status: newStatus,
            }
          : item
      )
    );

    // Record in history log
    const log: InventoryHistoryLog = {
      id: `log-${Date.now()}`,
      partName: selectedItemForIssue.name,
      action: 'Issued',
      quantity: qty,
      staff: issueStaff,
      relatedTask: issueTask,
      date: 'Just now',
    };
    setHistory((prev) => [log, ...prev]);

    setShowIssueModal(false);
    setSelectedItemForIssue(null);
  };

  const handleRestock = (id: string, amount: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return {
            ...item,
            quantity: newQty,
            status: newQty <= item.minStock ? 'Low Stock' : 'In Stock',
            lastRestocked: 'Today',
          };
        }
        return item;
      })
    );

    const target = items.find((i) => i.id === id);
    if (target) {
      setHistory((prev) => [
        {
          id: `log-${Date.now()}`,
          partName: target.name,
          action: 'Added',
          quantity: amount,
          staff: 'Admin Store Restock',
          date: 'Just now',
        },
        ...prev,
      ]);
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewSku('');
    setNewQuantity(10);
    setNewMinStock(5);
  };

  const filteredItems = items.filter((item) => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (
      search &&
      !item.name.toLowerCase().includes(search.toLowerCase()) &&
      !item.sku.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const lowStockItems = items.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock');

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Spare Parts & Hardware Inventory Management
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage campus maintenance stock, issue spare parts to tasks, monitor low-stock alerts & restock orders.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Items</p>
          <h4 className="text-xl font-black text-slate-900 mt-0.5">{items.length}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Cataloged parts</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Available Stock</p>
          <h4 className="text-xl font-black text-emerald-600 mt-0.5">
            {items.reduce((acc, i) => acc + i.quantity, 0)} Units
          </h4>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Ready for dispatch</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Low-Stock Items</p>
          <h4 className="text-xl font-black text-amber-600 mt-0.5">
            {items.filter((i) => i.status === 'Low Stock').length}
          </h4>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">Below threshold</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Out of Stock</p>
          <h4 className="text-xl font-black text-rose-600 mt-0.5">
            {items.filter((i) => i.status === 'Out of Stock').length}
          </h4>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Zero inventory</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Inventory Value</p>
          <h4 className="text-xl font-black text-indigo-600 mt-0.5">
            ₹{items.reduce((acc, i) => acc + i.quantity * i.unitCost, 0).toLocaleString('en-IN')}
          </h4>
          <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Valuation ledger</p>
        </div>
      </div>

      {/* Low Stock Warning Alert if any */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-900">
                Low Inventory Reorder Advisory ({lowStockItems.length} Items Require Restock)
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {lowStockItems.map((i) => `${i.name} (${i.quantity} left)`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('PURCHASE' as any)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
          >
            Create Purchase Requisition
          </button>
        </div>
      )}

      {/* Subtab Switcher */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setActiveSubTab('ITEMS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'ITEMS' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Spare Parts Catalog ({items.length})
          </button>
          <button
            onClick={() => setActiveSubTab('HISTORY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              activeSubTab === 'HISTORY' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Usage & Dispatch Logs ({history.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('PURCHASE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              activeSubTab === 'PURCHASE' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Purchase & Reorder</span>
          </button>
        </div>

        {activeSubTab === 'ITEMS' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search part name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        )}
      </div>

      {/* View: ITEMS CATALOG */}
      {activeSubTab === 'ITEMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-300 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                      {item.sku}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                      item.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Storage Location Capsule */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Storage:</span>
                    <span className="font-bold text-slate-700 text-[11px]">
                      {item.storageLocation.room} • {item.storageLocation.rack} ({item.storageLocation.shelf})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Available Stock:</span>
                    <span className="font-black text-slate-900 text-xs">
                      {item.quantity} {item.unit} (Min: {item.minStock})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[11px]">Unit Price:</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">
                      ₹{item.unitCost} / {item.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleRestock(item.id, 10)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Quick Add (10)
                </button>

                <button
                  disabled={item.quantity === 0}
                  onClick={() => {
                    setSelectedItemForIssue(item);
                    setShowIssueModal(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition flex items-center space-x-1 ${
                    item.quantity > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Issue to Staff</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View: USAGE & DISPATCH HISTORY */}
      {activeSubTab === 'HISTORY' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Inventory Movement & Usage Ledger</h3>
              <p className="text-xs text-slate-400">Audit trail of spare parts issued, returned, or consumed during repairs.</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{history.length} Log Entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.2 rounded-md font-bold text-[10px] ${
                        log.action === 'Issued'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : log.action === 'Added'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-extrabold text-slate-900">{log.partName}</span>
                    <span className="font-mono font-bold text-blue-600">({log.quantity} units)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Staff Member: <strong className="text-slate-700">{log.staff}</strong>
                    {log.relatedTask && (
                      <>
                        {' • '}Related Task: <span className="font-mono text-indigo-600 font-bold">{log.relatedTask}</span>
                      </>
                    )}
                  </p>
                </div>
                <span className="text-[10px] font-medium text-slate-400">{log.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: PURCHASE & RESTOCK ORDERS */}
      {activeSubTab === 'PURCHASE' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Purchase Orders & Supplier Requisition</h3>
              <p className="text-xs text-slate-400">Generate purchase requests for low-stock and out-of-stock items.</p>
            </div>
            <button
              onClick={() => alert('Purchase requisition #PR-2026-902 generated and submitted to Finance Office.')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Submit Order to Finance
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Suggested Reorder Basket</h4>
            <div className="space-y-2 text-xs">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">SKU: {item.sku} • Current Stock: {item.quantity} (Min: {item.minStock})</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-800">Order: 25 Units</span>
                    <span className="font-mono font-bold text-emerald-600">₹{(25 * item.unitCost).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Stock Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <h3 className="font-extrabold text-sm">Add Spare Part / Hardware Item</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Part / Hardware Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Havells 25A Modular AC Power Socket"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">SKU / Item Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ELE-SKT-25A"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    required
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Minimum Stock</label>
                  <input
                    type="number"
                    required
                    value={newMinStock}
                    onChange={(e) => setNewMinStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Storage Room</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rack</label>
                  <input
                    type="text"
                    value={newRack}
                    onChange={(e) => setNewRack(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Shelf</label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unit Purchase Cost (INR ₹)</label>
                <input
                  type="number"
                  value={newUnitCost}
                  onChange={(e) => setNewUnitCost(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue Stock */}
      {showIssueModal && selectedItemForIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Issue Spare Part to Technician</h3>
              <button onClick={() => setShowIssueModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleIssueStock} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-extrabold text-slate-900">{selectedItemForIssue.name}</p>
                <p className="text-[11px] text-slate-500">
                  SKU: {selectedItemForIssue.sku} • Available: <strong className="text-emerald-700">{selectedItemForIssue.quantity} {selectedItemForIssue.unit}</strong>
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Quantity (Max: {selectedItemForIssue.quantity})</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedItemForIssue.quantity}
                  value={issueQuantity}
                  onChange={(e) => setIssueQuantity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignee / Technician</label>
                <input
                  type="text"
                  required
                  value={issueStaff}
                  onChange={(e) => setIssueStaff(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Task / Work Order ID</label>
                <input
                  type="text"
                  required
                  value={issueTask}
                  onChange={(e) => setIssueTask(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagementView;
