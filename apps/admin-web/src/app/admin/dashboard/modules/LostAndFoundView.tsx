'use client';

import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Plus,
  Camera,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  Tag,
  AlertCircle,
  ArrowRight,
  X,
  Upload,
  Check,
  FileText
} from 'lucide-react';

export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'REPORTED' | 'FOUND' | 'CLAIMED' | 'RETURNED' | 'CLOSED';

export interface LostFoundItem {
  id: string;
  type: ItemType;
  itemName: string;
  category: 'ELECTRONICS' | 'DOCUMENTS_CARDS' | 'ACCESSORIES' | 'BOOKS' | 'KEYS' | 'OTHER';
  description: string;
  location: string;
  dateReported: string;
  status: ItemStatus;
  photoUrl?: string;
  reportedBy: string;
  contactNumber: string;
  custodyLocation?: string; // e.g. Gate 1 Security Desk
  claimantName?: string;
  claimantRoll?: string;
  returnedDate?: string;
}

const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: 'LNF-201',
    type: 'FOUND',
    itemName: 'HP 65W Blue-Pin Laptop Charger',
    category: 'ELECTRONICS',
    description: 'Black power brick with blue pin tip. Left on desk #14 in Central Library reading hall.',
    location: 'Central Library, 2nd Floor',
    dateReported: 'Today, 10:15 AM',
    status: 'FOUND',
    photoUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=60',
    reportedBy: 'Librarian Mr. Dash',
    contactNumber: '+91 98765-43201',
    custodyLocation: 'Security Gate 1 Reception Desk'
  },
  {
    id: 'LNF-202',
    type: 'LOST',
    itemName: 'Titan Neo Silver Dial Men’s Watch',
    category: 'ACCESSORIES',
    description: 'Stainless steel metal strap, light scratch on bezel. Lost during evening badminton match.',
    location: 'Campus Sports Indoor Complex',
    dateReported: 'Yesterday, 06:45 PM',
    status: 'REPORTED',
    photoUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=60',
    reportedBy: 'Amitav Mohanty (Student)',
    contactNumber: '+91 98765-43202'
  },
  {
    id: 'LNF-203',
    type: 'FOUND',
    itemName: 'Set of 3 Godrej Door Keys with Red Keychain',
    category: 'KEYS',
    description: 'Bunch of keys with red silicon "Avengers" tag. Found near water dispenser.',
    location: 'Hostel Block A, Ground Floor Mess Path',
    dateReported: 'Today, 08:30 AM',
    status: 'CLAIMED',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=60',
    reportedBy: 'Housekeeping Staff Ramesh',
    contactNumber: '+91 98765-43203',
    custodyLocation: 'Warden Office Block A',
    claimantName: 'Rohan Sen (Room A-108)',
    claimantRoll: '2023CS045'
  },
  {
    id: 'LNF-204',
    type: 'FOUND',
    itemName: 'State Bank of India Debit Card & College ID',
    category: 'DOCUMENTS_CARDS',
    description: 'Name on card: "Priya Sahoo". Found near SBI ATM vestibule outside Campus Gate 2.',
    location: 'Campus Gate 2 / ATM Corridor',
    dateReported: '02 Oct 2026',
    status: 'RETURNED',
    photoUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=400&auto=format&fit=crop&q=60',
    reportedBy: 'Security Guard Biranchi',
    contactNumber: '+91 98765-43204',
    custodyLocation: 'Security Control Room',
    claimantName: 'Priya Sahoo (Student)',
    claimantRoll: '2024EE019',
    returnedDate: '03 Oct 2026'
  }
];

export function LostAndFoundView() {
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'FOUND' | 'LOST' | 'RETURNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [claimModalItem, setClaimModalItem] = useState<LostFoundItem | null>(null);
  const [detailItem, setDetailItem] = useState<LostFoundItem | null>(null);

  // New Item State
  const [newType, setNewType] = useState<ItemType>('FOUND');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<any>('ELECTRONICS');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCustody, setNewCustody] = useState('Security Gate 1 Reception Desk');
  const [newReporter, setNewReporter] = useState('Security Desk');
  const [newPhone, setNewPhone] = useState('+91 98765-43200');
  const [newPhoto, setNewPhoto] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=60');

  // Claim Modal State
  const [claimantName, setClaimantName] = useState('');
  const [claimantRoll, setClaimantRoll] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredItems = items.filter((it) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'FOUND' && it.type === 'FOUND' && it.status !== 'RETURNED') ||
      (activeTab === 'LOST' && it.type === 'LOST' && it.status !== 'RETURNED') ||
      (activeTab === 'RETURNED' && (it.status === 'RETURNED' || it.status === 'CLOSED'));

    const matchesCategory = categoryFilter === 'ALL' || it.category === categoryFilter;
    const matchesSearch =
      it.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLocation) return;
    const item: LostFoundItem = {
      id: `LNF-${Math.floor(200 + Math.random() * 800)}`,
      type: newType,
      itemName: newName,
      category: newCategory,
      description: newDesc,
      location: newLocation,
      dateReported: 'Today, Just now',
      status: newType === 'FOUND' ? 'FOUND' : 'REPORTED',
      photoUrl: newPhoto,
      reportedBy: newReporter,
      contactNumber: newPhone,
      custodyLocation: newType === 'FOUND' ? newCustody : undefined
    };
    setItems([item, ...items]);
    setIsNewModalOpen(false);
    setNewName('');
    setNewDesc('');
    setNewLocation('');
  };

  const handleProcessClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalItem || !claimantName) return;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== claimModalItem.id) return t(it);
        return {
          ...it,
          status: 'RETURNED',
          claimantName: claimantName,
          claimantRoll: claimantRoll,
          returnedDate: 'Today'
        };
      })
    );
    setClaimModalItem(null);
    setClaimantName('');
    setClaimantRoll('');
    setVerificationNotes('');
  };

  function t(it: LostFoundItem) {
    return it;
  }

  const advanceItemStatus = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        let next: ItemStatus = it.status;
        if (it.status === 'REPORTED') next = 'FOUND';
        else if (it.status === 'FOUND') next = 'CLAIMED';
        else if (it.status === 'CLAIMED') next = 'RETURNED';
        else if (it.status === 'RETURNED') next = 'CLOSED';
        return { ...it, status: next };
      })
    );
  };

  const totalRegistered = items.length;
  const inCustodyFound = items.filter((i) => i.type === 'FOUND' && i.status === 'FOUND').length;
  const activeLost = items.filter((i) => i.type === 'LOST' && i.status === 'REPORTED').length;
  const reunitedCount = items.filter((i) => i.status === 'RETURNED' || i.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900/40 via-slate-900 to-slate-900 border border-amber-500/20 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Campus Property & Custody Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Lost & Found Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            Track reported lost personal belongings, catalog found articles, and verify claimant handovers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setNewType('LOST');
              setIsNewModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2.5 rounded-xl transition text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Report Lost Item</span>
          </button>
          <button
            onClick={() => {
              setNewType('FOUND');
              setIsNewModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-amber-600/30 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Register Found Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium">Total Registered</p>
            <p className="text-2xl font-black text-white mt-1">{totalRegistered}</p>
            <span className="text-[11px] text-slate-400">All recorded articles</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-medium">Found in Custody</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{inCustodyFound}</p>
            <span className="text-[11px] text-amber-500/70">Awaiting claimant</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-rose-400 text-xs font-medium">Active Lost Reports</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{activeLost}</p>
            <span className="text-[11px] text-rose-500/70">Students searching</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-medium">Reunited & Handed Over</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{reunitedCount}</p>
            <span className="text-[11px] text-emerald-500/70">Claim verified</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ALL'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('FOUND')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'FOUND'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Found in Custody
          </button>
          <button
            onClick={() => setActiveTab('LOST')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'LOST'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Lost Reports
          </button>
          <button
            onClick={() => setActiveTab('RETURNED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'RETURNED'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Returned / Resolved
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search item, location..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="DOCUMENTS_CARDS">Cards & IDs</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="KEYS">Keys</option>
            <option value="BOOKS">Books & Stationary</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isReturned = item.status === 'RETURNED' || item.status === 'CLOSED';
          const isFound = item.type === 'FOUND';

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="relative h-44 bg-slate-950 overflow-hidden group">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800/50">
                    <Package className="w-12 h-12 text-slate-600" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow ${
                      isFound ? 'bg-amber-500 text-slate-950 font-black' : 'bg-rose-500 text-white font-black'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono bg-black/60 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-md">
                    {item.id}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow backdrop-blur-md ${
                      isReturned
                        ? 'bg-emerald-500/80 text-white border-emerald-400'
                        : item.status === 'CLAIMED'
                        ? 'bg-blue-500/80 text-white border-blue-400'
                        : 'bg-black/70 text-slate-200 border-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.itemName}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </p>

                  <p className="mt-2.5 text-xs text-slate-300 line-clamp-2">{item.description}</p>

                  <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                    {item.custodyLocation && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400 text-[11px]">Custody:</span>
                        <span className="font-medium text-amber-400 truncate max-w-[160px]">
                          {item.custodyLocation}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Logged by:</span>
                      <span className="font-medium">{item.reportedBy}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Date:</span>
                      <span className="text-slate-400">{item.dateReported}</span>
                    </div>
                  </div>

                  {item.claimantName && (
                    <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-[11px]">
                      Reunited with: <span className="font-bold">{item.claimantName}</span> ({item.claimantRoll})
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailItem(item)}
                    className="text-xs text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
                  >
                    View Details
                  </button>

                  {!isReturned ? (
                    <button
                      onClick={() => setClaimModalItem(item)}
                      className="flex items-center space-x-1 text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-amber-600/20"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verify & Return</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Case Closed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Items Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting category or search filters.</p>
        </div>
      )}

      {/* Register Item Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  {newType === 'FOUND' ? 'Register Found Item' : 'Log Lost Item Report'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="flex items-center space-x-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewType('FOUND')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    newType === 'FOUND'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Found Item (In Custody)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('LOST')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    newType === 'LOST'
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lost Report (Searching)
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio FX-991EX Calculator with black cover"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="DOCUMENTS_CARDS">Cards & IDs</option>
                    <option value="ACCESSORIES">Accessories & Watch</option>
                    <option value="KEYS">Keys & Locks</option>
                    <option value="BOOKS">Books & Stationary</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {newType === 'FOUND' ? 'Found Location' : 'Last Seen Location'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Library Floor 1"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {newType === 'FOUND' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Safe Custody Location</label>
                  <input
                    type="text"
                    value={newCustody}
                    onChange={(e) => setNewCustody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Description & Marks</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Color, brand, scratch marks, stickers, serial digits..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Reported By</label>
                  <input
                    type="text"
                    value={newReporter}
                    onChange={(e) => setNewReporter(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify & Claim Return Modal */}
      {claimModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Handover & Claim Verification</h3>
              </div>
              <button
                onClick={() => setClaimModalItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <p className="font-bold text-white">{claimModalItem.itemName}</p>
              <p className="text-slate-400">{claimModalItem.description}</p>
              <p className="text-amber-400 font-mono text-[11px]">ID: {claimModalItem.id}</p>
            </div>

            <form onSubmit={handleProcessClaim} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Claimant Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subham Pradhan"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Student Roll / Registration No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023CS012"
                  value={claimantRoll}
                  onChange={(e) => setClaimantRoll(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Verification Proof / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Identity verified with College ID card, password unlock confirmed, signature obtained."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setClaimModalItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Confirm Handover & Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail View */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">{detailItem.itemName}</h3>
              <button
                onClick={() => setDetailItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailItem.photoUrl && (
              <img
                src={detailItem.photoUrl}
                alt={detailItem.itemName}
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">{detailItem.description}</p>
              <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 border border-slate-800 text-slate-400">
                <p>Location: <span className="text-white">{detailItem.location}</span></p>
                <p>Status: <span className="text-amber-400 font-bold">{detailItem.status}</span></p>
                <p>Reported By: <span className="text-white">{detailItem.reportedBy}</span> ({detailItem.contactNumber})</p>
                {detailItem.custodyLocation && (
                  <p>Custody: <span className="text-white">{detailItem.custodyLocation}</span></p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
