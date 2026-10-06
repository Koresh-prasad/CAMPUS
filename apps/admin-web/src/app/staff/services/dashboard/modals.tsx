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
} from 'lucide-react';
import {
  ServiceRequest,
  ServiceCategory,
  ServicePriority,
  ServiceStatus,
  ServiceInventoryItem,
} from './types';

// ===================================================================
// 1. CREATE SERVICE TICKET MODAL
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
  const [hostel, setHostel] = useState('Nilgiri Residence (Block A)');
  const [room, setRoom] = useState('A-204');
  const [category, setCategory] = useState<ServiceCategory>('Plumbing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ServicePriority>('MEDIUM');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onCreateTicket({
      ticketNumber: `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName,
      studentId: 'CS2023042',
      studentRoll,
      studentPhone: '+91 98765 43210',
      hostel,
      room,
      category,
      title,
      description,
      priority,
      assignedStaffName: 'Unassigned (Awaiting Dispatch)',
      status: 'New',
      createdTime: 'Just now',
      updatedTime: 'Just now',
      slaDue: priority === 'CRITICAL' ? 'Within 2 hours' : 'Within 24 hours',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Wrench className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Create New Service Work Order</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hostel</label>
              <input
                type="text"
                required
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Room Number</label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
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
                <option value="Wi-Fi">Wi-Fi & Networks</option>
                <option value="Water">Water Supply</option>
                <option value="Furniture">Furniture</option>
                <option value="Room Repair">Room Repair</option>
                <option value="Hostel">Hostel Common</option>
                <option value="Mess">Mess / Dining</option>
                <option value="Other">Other Maintenance</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority SLA</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="LOW">Low (Within 48h)</option>
                <option value="MEDIUM">Medium (Within 24h)</option>
                <option value="HIGH">High (Within 6h)</option>
                <option value="CRITICAL">Critical / Hazard (Within 2h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Issue Summary / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Washroom tap continuous drip and low pressure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact defect location, symptoms, or hazard risks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Generate Work Order Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
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
