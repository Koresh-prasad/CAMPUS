'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Wrench,
  AlertTriangle,
  Clock,
  User,
  Package,
  CheckCircle2,
  HelpCircle,
  Phone,
  Building,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Star,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  ServiceRequest,
  ServiceCategory,
  ServicePriority,
  ServiceStatus,
  ServiceInventoryItem,
} from './types';

// ===================================================================
// 1. CREATE SERVICE TICKET MODAL (WITH CATEGORIES & PHOTO UPLOAD)
// ===================================================================
export function CreateServiceTicketModal({
  isOpen,
  onClose,
  onCreateTicket,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (t: Partial<ServiceRequest>) => void;
}) {
  const [studentName, setStudentName] = useState('Subham Pradhan');
  const [studentRoll, setStudentRoll] = useState('REC-2023-CS042');
  const [studentPhone, setStudentPhone] = useState('+91 98765 43210');
  const [hostel, setHostel] = useState('Nilgiri Residence (Block A)');
  const [room, setRoom] = useState('A-204');
  const [category, setCategory] = useState<ServiceCategory>('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ServicePriority>('MEDIUM');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const samplePhotos: { label: string; url: string; cat: ServiceCategory }[] = [
    { label: '🚰 Tap Leak', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400', cat: 'Plumbing' },
    { label: '⚡ Fan / Spark', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', cat: 'Electrical' },
    { label: '🧹 Floor Drain', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400', cat: 'Cleaning' },
    { label: '📶 Wi-Fi Router', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400', cat: 'Wi-Fi' },
    { label: '🪑 Desk / Chair', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', cat: 'Furniture' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onCreateTicket({
      ticketNumber: `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName,
      studentId: 'CS2023042',
      studentRoll,
      studentPhone,
      hostel,
      room,
      category,
      title,
      description,
      photoUrl: photoPreview || photoUrl || undefined,
      priority,
      assignedStaffName: 'Unassigned (Awaiting Dispatch)',
      status: 'New',
      createdTime: 'Just now',
      updatedTime: 'Just now',
      slaDue: priority === 'CRITICAL' ? 'Within 2 hours' : priority === 'HIGH' ? 'Within 6 hours' : 'Within 24 hours',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Raise a Service Request</h3>
              <p className="text-[11px] text-blue-100">Submit new campus maintenance ticket with photo & category</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          {/* Student Info */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Student Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hostel</label>
                <input
                  type="text"
                  required
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Electrical">⚡ Electrical (Fan, Light, Switch, MCB)</option>
                <option value="Plumbing">🚰 Plumbing (Tap, Pipe, Flush, Basin)</option>
                <option value="Cleaning">🧹 Sweeper / Cleaning (Room, Washroom, Drain)</option>
                <option value="Wi-Fi">📶 Internet / Wi-Fi (Router, LAN, Signal)</option>
                <option value="Furniture">🪑 Furniture (Bed, Desk, Chair, Cupboard)</option>
                <option value="Water">💧 Water Supply & RO Purifiers</option>
                <option value="Room Repair">🔨 Room Repair & Carpentry</option>
                <option value="Mess">🍽️ Mess & Canteen Facilities</option>
                <option value="Other">🔧 Other Campus Maintenance</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority SLA</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="LOW">Low (Within 48h)</option>
                <option value="MEDIUM">Medium (Within 24h)</option>
                <option value="HIGH">High (Within 6h)</option>
                <option value="CRITICAL">🚨 Critical / Hazard (Within 2h)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Issue Summary / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Washroom tap continuous dripping & low pressure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact defect location, symptoms, urgency, or hazard risks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Photo Attachment Section */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Attach Issue Photo (Optional)</span>
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => { setPhotoPreview(null); setPhotoUrl(''); }}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  ✕ Remove photo
                </button>
              )}
            </div>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black/5 flex items-center justify-center max-h-48">
                <img src={photoPreview} alt="Issue preview" className="object-contain max-h-48 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white transition group">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1 transition" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">Click to upload photo from device</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
                </label>

                {/* Quick Sample Presets */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-slate-400 mb-1.5">Or choose sample photo for testing:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePhotos.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setPhotoPreview(p.url);
                          setPhotoUrl(p.url);
                          if (category === 'Plumbing' && p.cat) setCategory(p.cat);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200 text-[10px] font-bold transition cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Raise Service Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. UPDATE TICKET STATUS / RESOLVE MODAL
// ===================================================================
export function UpdateTicketStatusModal({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
}: {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: ServiceStatus, notes?: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus>('In Progress');
  const [notes, setNotes] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(ticket.id, selectedStatus, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm">Update Service Ticket #{ticket.ticketNumber}</h3>
            <p className="text-xs text-slate-300 truncate">{ticket.title}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">{ticket.studentName} ({ticket.studentRoll})</p>
            <p className="text-slate-500">{ticket.hostel} • Room {ticket.room}</p>
            <p className="text-slate-700 text-[11px] font-medium mt-1">{ticket.description}</p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">New Workflow Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Accepted">Accepted by Technician</option>
              <option value="In Progress">In Progress (Work Underway)</option>
              <option value="Resolved">Resolved (Work Completed)</option>
              <option value="Student Confirmed">Student Confirmed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Work Log Notes / Parts Replaced</label>
            <textarea
              rows={3}
              placeholder="e.g. Replaced leaking brass mixer valve and tested pressure; no seepage detected."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Save Workflow Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 3. ASSIGN STAFF MODAL
// ===================================================================
export function AssignStaffModal({
  ticket,
  isOpen,
  onClose,
  onAssign,
}: {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (ticketId: string, staffName: string) => void;
}) {
  const [selectedStaff, setSelectedStaff] = useState('Mahendra Singh (Lead Plumber)');

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(ticket.id, selectedStaff);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <h3 className="font-extrabold text-sm">Assign Staff Technician</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Ticket Number</label>
            <p className="font-mono font-bold text-blue-600">{ticket.ticketNumber} • {ticket.category}</p>
            <p className="text-slate-500 text-[11px] truncate">{ticket.title}</p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Technician</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Mahendra Singh (Lead Plumber)">Mahendra Singh (Lead Plumber)</option>
              <option value="Dillip Das (Electrician)">Dillip Das (Electrician)</option>
              <option value="Suresh Kumar (Network Tech)">Suresh Kumar (Network Tech)</option>
              <option value="Baidhar Rout (Carpenter)">Baidhar Rout (Carpenter)</option>
              <option value="Ramesh Behera (Housekeeping Lead)">Ramesh Behera (Housekeeping Lead)</option>
              <option value="Kailash Nayak (Mess Equipment Lead)">Kailash Nayak (Mess Equipment Lead)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Assign & Notify Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 4. ADD INVENTORY ITEM MODAL
// ===================================================================
export function AddInventoryItemModal({
  isOpen,
  onClose,
  onAddItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Partial<ServiceInventoryItem>) => void;
}) {
  const [name, setName] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Electrical');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('Pieces');
  const [minStock, setMinStock] = useState(5);
  const [location, setLocation] = useState('Main Maintenance Shed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddItem({
      itemCode: itemCode || `ITM-${Date.now().toString().slice(-5)}`,
      name,
      category,
      quantity,
      unit,
      minStock,
      location,
      condition: 'GOOD',
      lastRestocked: 'Today',
      isLowStock: quantity <= minStock,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Add Spare Part / Stock Item</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Item Description / Part Name</label>
            <input
              type="text"
              required
              placeholder="e.g. 15mm Brass Tap Spindle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Wi-Fi">Wi-Fi & Network</option>
                <option value="Water">Water Purification</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">SKU / Item Code</label>
              <input
                type="text"
                placeholder="PLB-VAL-15"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity</label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Threshold</label>
              <input
                type="number"
                min={1}
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Storage Bay Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 5. SERVICE HELP & SOPS MODAL
// ===================================================================
export function ServiceHelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm">Campus Services SOPs & Directory</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-extrabold text-blue-900 text-xs">Standard SLA Resolution Commitments</h4>
            <p className="text-blue-800">
              • <strong>Critical Hazard (Electrical spark, flooding):</strong> Within 2 hours.<br />
              • <strong>High Priority (Water supply, Wi-Fi outage):</strong> Within 6 hours.<br />
              • <strong>Routine Repairs (Furniture, fan regulator):</strong> Within 24-48 hours.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900">Key Emergency Escalation Contacts</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Chief Electrician</p>
                <p className="font-mono text-blue-600 font-bold">+91 94370 11822</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Senior Plumber</p>
                <p className="font-mono text-blue-600 font-bold">+91 94370 77102</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Hostel Warden Desk</p>
                <p className="font-mono text-blue-600 font-bold">+91 94370 88210</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Main Gate Security</p>
                <p className="font-mono text-blue-600 font-bold">+91 94370 88214</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-600 space-y-1">
            <h4 className="font-extrabold text-slate-900">Technician Safety Requirements</h4>
            <p>1. Always switch off main MCB isolator before opening electrical switchboards.</p>
            <p>2. Maintain photographic evidence before and after repairing hostel rooms.</p>
            <p>3. Always seek resident or hostel warden presence when entering student bedrooms.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ===================================================================
// 6. TRACK STATUS MODAL (DETAILED MULTI-STEP PROGRESSION PIPELINE)
// ===================================================================
export function TrackStatusModal({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
  onAssignStaff,
}: {
  ticket: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: ServiceStatus, notes?: string) => void;
  onAssignStaff?: (ticketId: string, staffName: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'PHOTO' | 'NOTES'>('TIMELINE');
  const [resolutionNote, setResolutionNote] = useState('');

  if (!isOpen || !ticket) return null;

  const steps = [
    {
      id: 'New',
      title: 'Request Raised',
      desc: `Logged by ${ticket.studentName}`,
      time: ticket.createdTime,
      isPassed: true,
      isCurrent: ticket.status === 'New',
    },
    {
      id: 'Assigned',
      title: 'Technician Assigned',
      desc: ticket.assignedStaffName !== 'Unassigned (Awaiting Dispatch)' ? ticket.assignedStaffName : 'Pending dispatcher',
      time: ticket.status !== 'New' ? ticket.createdTime : 'Pending',
      isPassed: ticket.status !== 'New',
      isCurrent: ticket.status === 'Assigned' || ticket.status === 'Accepted',
    },
    {
      id: 'In Progress',
      title: 'Work In Progress',
      desc: 'Technician inspecting & repairing on site',
      time: ticket.status === 'In Progress' || ticket.status === 'Resolved' || ticket.status === 'Student Confirmed' || ticket.status === 'Closed' ? ticket.updatedTime : 'Pending',
      isPassed: ticket.status === 'In Progress' || ticket.status === 'Resolved' || ticket.status === 'Student Confirmed' || ticket.status === 'Closed',
      isCurrent: ticket.status === 'In Progress',
    },
    {
      id: 'Resolved',
      title: 'Issue Resolved',
      desc: ticket.completionNote || 'Repairs completed & tested',
      time: ticket.status === 'Resolved' || ticket.status === 'Student Confirmed' || ticket.status === 'Closed' ? ticket.updatedTime : 'Pending',
      isPassed: ticket.status === 'Resolved' || ticket.status === 'Student Confirmed' || ticket.status === 'Closed',
      isCurrent: ticket.status === 'Resolved',
    },
    {
      id: 'Closed',
      title: 'Student Confirmed & Closed',
      desc: ticket.studentFeedback || 'Final sign-off by resident student',
      time: ticket.status === 'Student Confirmed' || ticket.status === 'Closed' ? ticket.updatedTime : 'Pending',
      isPassed: ticket.status === 'Student Confirmed' || ticket.status === 'Closed',
      isCurrent: ticket.status === 'Student Confirmed' || ticket.status === 'Closed',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-xs text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30">
                {ticket.ticketNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {ticket.category}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ticket.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30' : 'bg-slate-700 text-slate-300'
              }`}>
                {ticket.priority} Priority
              </span>
            </div>
            <h3 className="font-extrabold text-base text-white mt-1.5">{ticket.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Student Info Capsule */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                {ticket.studentName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm leading-tight">{ticket.studentName}</p>
                <p className="text-[11px] text-slate-500">Roll: {ticket.studentRoll} • Phone: {ticket.studentPhone || '+91 98765 43210'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 text-xs">{ticket.hostel}</p>
              <p className="text-[11px] font-black text-blue-600">Room: {ticket.room}</p>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Defect Description</label>
            <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700 font-medium">
              {ticket.description}
            </p>
          </div>

          {/* Attached Photo Preview if Available */}
          {ticket.photoUrl && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center space-x-1">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Student Attached Photo</span>
                </label>
                <a
                  href={ticket.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 max-h-56 flex items-center justify-center">
                <img src={ticket.photoUrl} alt="Defect" className="object-contain max-h-56 w-full" />
              </div>
            </div>
          )}

          {/* Stepper Pipeline */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Live Status Tracker Pipeline
              </label>
              <span className="font-mono text-[10px] font-bold text-slate-400">SLA: {ticket.slaDue}</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
              {steps.map((st, i) => (
                <div key={st.id} className="relative">
                  <div
                    className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                      st.isPassed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : st.isCurrent
                        ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {st.isPassed ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-800 text-xs">{st.title}</p>
                      <span className="text-[10px] text-slate-400">{st.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions to Advance Status */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Quick Workflow Action</span>
              <span className="text-[11px] font-black text-blue-700 uppercase">Current: {ticket.status}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ticket.status === 'New' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(ticket.id, 'Assigned')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    Mark Assigned
                  </button>
                  <button
                    onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  >
                    Start Work Now (In Progress)
                  </button>
                </>
              )}

              {(ticket.status === 'Assigned' || ticket.status === 'Accepted') && (
                <button
                  onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Start Work (In Progress)
                </button>
              )}

              {ticket.status === 'In Progress' && (
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    placeholder="Enter resolution notes / parts replaced before completing..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full p-2 bg-white border border-blue-200 rounded-xl text-xs font-medium"
                  />
                  <button
                    onClick={() => {
                      onUpdateStatus(ticket.id, 'Resolved', resolutionNote || 'Work completed and verified.');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete & Mark as Resolved</span>
                  </button>
                </div>
              )}

              {ticket.status === 'Resolved' && (
                <button
                  onClick={() => {
                    onUpdateStatus(ticket.id, 'Closed', 'Resident verified & signed off.');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Student Satisfaction & Close</span>
                </button>
              )}

              {(ticket.status === 'Closed' || ticket.status === 'Student Confirmed') && (
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>This ticket is closed and archived in Request History.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-white cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
