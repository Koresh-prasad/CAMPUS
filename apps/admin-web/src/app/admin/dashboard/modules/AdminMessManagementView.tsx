'use client';

import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Clock,
  Plus,
  X,
  Save,
  RefreshCw,
  Check,
  CheckCircle2,
  Sparkles,
  Download,
  Eye,
  FileText,
  Calendar,
  Coffee,
  Sun,
  Moon,
  Trash2,
  Edit2,
  Printer,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Users,
} from 'lucide-react';

interface MealSlots {
  BREAKFAST: string;
  LUNCH: string;
  SNACKS: string;
  DINNER: string;
}

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const DEFAULT_SCHEDULE: Record<string, MealSlots> = {
  MONDAY: {
    BREAKFAST: 'Aloo Paratha with Curd & Pickle, Boiled Eggs / Banana, Masala Chai & Filter Coffee',
    LUNCH: 'Dal Tadka, Shahi Paneer, Jeera Rice, Tawa Roti, Boondi Raita, Green Salad',
    SNACKS: 'Crispy Veg Samosa with Mint & Tamarind Chutney, Hot Adrak Chai',
    DINNER: 'Rajma Masala, Kashmiri Pulao, Butter Chapati, Roasted Papad, Hot Gulab Jamun',
  },
  TUESDAY: {
    BREAKFAST: 'South Indian Idli & Medu Vada, Coconut Chutney, Hot Sambar, Coffee & Milk',
    LUNCH: 'Punjabi Chole, Steamed Basmati Rice, Bhature / Phulka Roti, Mix Veg Raita, Pickle',
    SNACKS: 'Crispy Bread Pakora with Tomato Chutney, Hot Ginger Tea',
    DINNER: 'Mix Veg Korma, Dal Palak, Steamed Rice, Butter Roti, Rice Kheer',
  },
  WEDNESDAY: {
    BREAKFAST: 'Indori Poha with Sev & Anar, Sprouts Chaat, Boiled Eggs / Fresh Apple, Lemon Tea',
    LUNCH: 'Kadhi Pakora, Steamed Basmati Rice, Aloo Gobi Matar, Phulka Roti, Roasted Papad',
    SNACKS: 'Crispy Veg Cutlets, Sweet & Sour Chutney, Masala Chai',
    DINNER: 'Paneer Butter Masala / Egg Curry, Veg Pulao, Tandoori Roti, Vanilla Ice Cream',
  },
  THURSDAY: {
    BREAKFAST: 'Methi Thepla with Chhundo, Sprouts, Boiled Eggs / Banana, Masala Tea',
    LUNCH: 'Dal Makhani, Bhindi Do Pyaza, Jeera Rice, Phulka Roti, Dahi Salad',
    SNACKS: 'Poha Chivda & Roasted Salted Peanuts, Elaichi Chai / Filter Coffee',
    DINNER: 'Malai Kofta, Kashmiri Dum Aloo, Steamed Basmati Rice, Butter Naan, Moong Dal Halwa',
  },
  FRIDAY: {
    BREAKFAST: 'Crispy Masala Dosa & Upma, Coconut & Tomato Chutney, Sambar, Filter Coffee',
    LUNCH: 'Dum Biryani (Veg & Chicken Counters), Mirchi Ka Salan, Burani Raita, Phulka Roti',
    SNACKS: 'Pyaz & Mix Veg Pakoda, Mint Chutney, Hot Cutting Chai',
    DINNER: 'Matar Paneer, Yellow Moong Dal Fry, Peas Pulao, Tawa Paratha, Bengali Rasgulla',
  },
  SATURDAY: {
    BREAKFAST: 'Puri Bhaji with Suji Halwa, Boiled Eggs / Seasonal Fruits, Masala Chai',
    LUNCH: 'Veg Fried Rice, Hakka Noodles, Veg Manchurian Gravy, Spring Roll, Sweet Corn Soup',
    SNACKS: 'Mumbai Bhelpuri & Sev Puri Counter, Lemon Iced Tea',
    DINNER: 'Dal Maharani, Baingan Bharta, Steamed Basmati Rice, Chapati, Fresh Fruit Custard',
  },
  SUNDAY: {
    BREAKFAST: 'Chole Bhature Special, Medu Vada, Sweet Lassi, Seasonal Cut Fruits',
    LUNCH: 'Grand Sunday Feast: Paneer Tikka Masala, Veg Dum Biryani, Garlic Naan, Boondi Raita, Gulab Jamun',
    SNACKS: 'Special Grilled Cheese Sandwiches, Cold Coffee with Chocolate Ice Cream',
    DINNER: 'Sunday Festive Gala: Shahi Paneer, Kashmiri Pulao, Butter Paratha, Royal Rasmalai',
  },
};

export function AdminMessManagementView() {
  const [schedule, setSchedule] = useState<Record<string, MealSlots>>(DEFAULT_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState<string>('MONDAY');
  const [todayDayName, setTodayDayName] = useState<string>('MONDAY');
  const [loading, setLoading] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Quick Add Dish Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [modalDay, setModalDay] = useState<string>('MONDAY');
  const [modalMeal, setModalMeal] = useState<'BREAKFAST' | 'LUNCH' | 'SNACKS' | 'DINNER'>('BREAKFAST');
  const [modalDishName, setModalDishName] = useState<string>('');
  const [modalDietary, setModalDietary] = useState<string>('VEG');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);

  // Per-slot inline Add Dish state
  const [inlineSlot, setInlineSlot] = useState<string | null>(null);
  const [inlineDishInput, setInlineDishInput] = useState<string>('');

  // Per-slot full text editing state
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [editSlotText, setEditSlotText] = useState<string>('');

  // Headcounts & festival
  const [headcounts, setHeadcounts] = useState({ breakfast: 184, lunch: 215, snacks: 140, dinner: 230 });
  const [festivalData, setFestivalData] = useState<any>(null);

  // Fetch live menu from API
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.schedule) {
          setSchedule(data.schedule);
        }
        if (data.today?.day) {
          setTodayDayName(data.today.day);
          setSelectedDay(data.today.day);
        }
        if (data.today?.headcounts) {
          setHeadcounts(data.today.headcounts);
        }
        if (data.festivalSpecial) {
          setFestivalData(data.festivalSpecial);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 1. Add Dish
  const handleAddDish = async (day: string, meal: string, dish: string) => {
    const trimmed = dish.trim();
    if (!trimmed) return;
    try {
      const res = await fetch('/api/menu/add-dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: day,
          mealType: meal,
          dishName: trimmed,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update local state
        setSchedule((prev) => {
          const dayData = prev[day] || DEFAULT_SCHEDULE[day] || { BREAKFAST: '', LUNCH: '', SNACKS: '', DINNER: '' };
          const currentSlot = dayData[meal as keyof MealSlots] || '';
          const list = currentSlot ? currentSlot.split(',').map((s) => s.trim()) : [];
          if (!list.includes(trimmed)) list.push(trimmed);
          return {
            ...prev,
            [day]: {
              ...dayData,
              [meal]: list.join(', '),
            },
          };
        });
        setStatusMsg(`✓ "${trimmed}" added to ${day} ${meal} & broadcasted to all students!`);
        setShowAddModal(false);
        setModalDishName('');
        setInlineSlot(null);
        setInlineDishInput('');
        setTimeout(() => setStatusMsg(''), 5000);
      } else {
        alert(data.error || 'Failed to add dish');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to backend service');
    }
  };

  // 2. Remove Dish
  const handleRemoveDish = async (day: string, meal: string, dish: string) => {
    if (!confirm(`Are you sure you want to remove "${dish}" from ${day} ${meal}?`)) return;
    try {
      const res = await fetch('/api/menu/remove-dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: day,
          mealType: meal,
          dishName: dish,
        }),
      });
      if (res.ok) {
        setSchedule((prev) => {
          const dayData = prev[day] || DEFAULT_SCHEDULE[day];
          const currentSlot = dayData[meal as keyof MealSlots] || '';
          const list = currentSlot
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s && s.toLowerCase() !== dish.toLowerCase());
          return {
            ...prev,
            [day]: {
              ...dayData,
              [meal]: list.join(', '),
            },
          };
        });
        setStatusMsg(`✓ "${dish}" removed and menu synced for all students.`);
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Save Edited Slot
  const handleSaveSlot = async (day: string, meal: string, items: string) => {
    try {
      const res = await fetch('/api/menu/update-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: day,
          mealType: meal,
          items: items.trim(),
        }),
      });
      if (res.ok) {
        setSchedule((prev) => ({
          ...prev,
          [day]: {
            ...(prev[day] || DEFAULT_SCHEDULE[day]),
            [meal]: items.trim(),
          },
        }));
        setEditingSlot(null);
        setStatusMsg(`✓ ${day} ${meal} updated and published live to all students!`);
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Reset Defaults
  const handleResetDefaults = async () => {
    if (!confirm('Reset all 7 days to standard campus hostel rotation? Custom added dishes will be restored.')) return;
    try {
      const res = await fetch('/api/menu/reset-defaults', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.schedule) {
        setSchedule(data.schedule);
        setStatusMsg('✓ Menu reset to standard 7-day campus rotation for all students!');
        setTimeout(() => setStatusMsg(''), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentMeals: MealSlots =
    schedule[selectedDay] || DEFAULT_SCHEDULE[selectedDay] || DEFAULT_SCHEDULE['MONDAY'];

  const mealSlotConfigs = [
    {
      key: 'BREAKFAST',
      label: 'Breakfast',
      timing: '07:30 AM – 09:30 AM',
      icon: Coffee,
      headcount: headcounts.breakfast,
      themeColor: 'amber',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      headerBg: 'bg-amber-500/10 text-amber-700',
    },
    {
      key: 'LUNCH',
      label: 'Lunch',
      timing: '12:30 PM – 02:30 PM',
      icon: Sun,
      headcount: headcounts.lunch,
      themeColor: 'blue',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      headerBg: 'bg-blue-500/10 text-blue-700',
    },
    {
      key: 'SNACKS',
      label: 'Evening Snacks',
      timing: '05:00 PM – 06:30 PM',
      icon: Sparkles,
      headcount: headcounts.snacks,
      themeColor: 'emerald',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      headerBg: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      key: 'DINNER',
      label: 'Dinner',
      timing: '08:00 PM – 10:00 PM',
      icon: Moon,
      headcount: headcounts.dinner,
      themeColor: 'purple',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      headerBg: 'bg-purple-500/10 text-purple-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & OPERATIONAL STATUS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Campus Dining & Mess Food Administration
              </h3>
              <p className="text-xs text-slate-500">
                Full-week food list: Breakfast • Lunch • Evening Snacks • Dinner. Real-time broadcast to all 2,485 students.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>🟢 Live Synced with Student App</span>
          </div>

          <button
            onClick={() => {
              setModalDay(selectedDay);
              setModalMeal('BREAKFAST');
              setShowAddModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Dish to Menu</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'CARDS' ? 'TABLE' : 'CARDS')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Toggle between daily cards and weekly table"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{viewMode === 'CARDS' ? 'Full Week Timetable Matrix' : 'Daily Cards View'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200 transition cursor-pointer"
            title="Reset standard campus food rotation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button onClick={() => setStatusMsg('')} className="text-emerald-600 hover:text-emerald-800 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. 4 MEAL TIMING & HEADCOUNT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center space-x-1">
              <Coffee className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
              Breakfast
            </p>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
              {headcounts.breakfast} Students
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900">07:30 AM – 09:30 AM</h4>
          <p className="text-[10px] text-slate-500">Morning buffet &amp; tea/coffee counter</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
              Lunch
            </p>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
              {headcounts.lunch} Students
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900">12:30 PM – 02:30 PM</h4>
          <p className="text-[10px] text-slate-500">Full course meal with dal, rice &amp; curd</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
              Evening Snacks
            </p>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
              {headcounts.snacks} Students
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900">05:00 PM – 06:30 PM</h4>
          <p className="text-[10px] text-slate-500">Fresh hot snacks &amp; adrak/masala tea</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider flex items-center space-x-1">
              <Moon className="w-3.5 h-3.5 inline mr-1 text-purple-500" />
              Dinner
            </p>
            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">
              {headcounts.dinner} Students
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900">08:00 PM – 10:00 PM</h4>
          <p className="text-[10px] text-slate-500">Dinner feast with warm desserts</p>
        </div>
      </div>

      {/* 3. 7-DAY WEEK SELECTOR BAR */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
            Select Day of the Week (Monday – Sunday)
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Click day to manage its Breakfast, Lunch, Snacks &amp; Dinner
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = todayDayName === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 ring-2 ring-amber-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white text-amber-700' : 'bg-amber-500 text-white'
                    }`}
                  >
                    TODAY
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN CONTENT: CARDS VIEW OR FULL-WEEK MATRIX */}
      {viewMode === 'CARDS' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-extrabold text-slate-900">
                {selectedDay} Meal Timetable
              </h4>
              {selectedDay === todayDayName && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                  Serving Today
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">
              4 Meal Slots • Add, modify or delete individual dishes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealSlotConfigs.map((slot) => {
              const Icon = slot.icon;
              const rawItemsString = currentMeals[slot.key as keyof MealSlots] || '';
              const dishList = rawItemsString
                .split(',')
                .map((d) => d.trim())
                .filter(Boolean);

              const isInlineAdding = inlineSlot === slot.key;
              const isEditing = editingSlot === slot.key;

              return (
                <div
                  key={slot.key}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-xl ${slot.headerBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900 tracking-tight">
                            {slot.label}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-medium">{slot.timing}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingSlot(null);
                            } else {
                              setEditingSlot(slot.key);
                              setEditSlotText(rawItemsString);
                              setInlineSlot(null);
                            }
                          }}
                          className="px-2 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer flex items-center space-x-1"
                          title="Edit full slot description"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{isEditing ? 'Cancel' : 'Edit Slot'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Display or Full Slot Editor */}
                    {isEditing ? (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-600">
                          Edit Comma-Separated Food List:
                        </p>
                        <textarea
                          rows={3}
                          value={editSlotText}
                          onChange={(e) => setEditSlotText(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="e.g. Aloo Paratha, Curd, Masala Chai..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSlot(null)}
                            className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveSlot(selectedDay, slot.key, editSlotText)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save &amp; Broadcast</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {dishList.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No dishes listed yet for this meal slot.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {dishList.map((dish, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${slot.badgeBg}`}
                              >
                                <span>{dish}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDish(selectedDay, slot.key, dish)}
                                  className="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center transition ml-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                                  title={`Remove ${dish}`}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Inline Quick Add Dish Input */}
                    {isInlineAdding ? (
                      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 animate-in fade-in">
                        <input
                          type="text"
                          autoFocus
                          placeholder={`Enter dish name for ${slot.label}...`}
                          value={inlineDishInput}
                          onChange={(e) => setInlineDishInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddDish(selectedDay, slot.key, inlineDishInput);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddDish(selectedDay, slot.key, inlineDishInput)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Add Dish
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineSlot(null);
                            setInlineDishInput('');
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {dishList.length} dish items registered
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInlineSlot(slot.key);
                            setInlineDishInput('');
                            setEditingSlot(null);
                          }}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1 cursor-pointer py-1 px-2 rounded-lg hover:bg-amber-50 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Dish</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. FULL WEEK TIMETABLE MATRIX TABLE */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-2">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black tracking-wide uppercase">
                7-Day Weekly Mess Food Matrix (Monday to Sunday)
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              All 4 Slots Synchronized Across Campus
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Day of Week</th>
                  <th className="py-3 px-4">🌅 Breakfast (07:30 - 09:30)</th>
                  <th className="py-3 px-4">☀️ Lunch (12:30 - 14:30)</th>
                  <th className="py-3 px-4">☕ Evening Snacks (17:00 - 18:30)</th>
                  <th className="py-3 px-4">🌙 Dinner (20:00 - 22:00)</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {DAYS_OF_WEEK.map((day) => {
                  const m = schedule[day] || DEFAULT_SCHEDULE[day];
                  const isToday = todayDayName === day;
                  return (
                    <tr
                      key={day}
                      className={`hover:bg-slate-50/70 transition ${isToday ? 'bg-amber-50/40 font-medium' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{day}</span>
                          {isToday && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black">
                              TODAY
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600" title={m.BREAKFAST}>
                        {m.BREAKFAST}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600" title={m.LUNCH}>
                        {m.LUNCH}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600" title={m.SNACKS}>
                        {m.SNACKS}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600" title={m.DINNER}>
                        {m.DINNER}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                            setViewMode('CARDS');
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer px-2 py-1 rounded hover:bg-blue-50"
                        >
                          Manage Day &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUNDAY FESTIVAL FEAST HIGHLIGHT BANNER */}
      {festivalData && (
        <div className="bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-purple-600/10 border border-amber-300 rounded-2xl p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold">🎉</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">{festivalData.title}</h4>
                <p className="text-[11px] text-amber-800">{festivalData.occasion} • {festivalData.date}</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-amber-200 text-amber-900 rounded-full">
              Hostel Grand Dining Hall
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Breakfast Special</span>
              <p className="text-slate-800 font-medium mt-0.5">{festivalData.breakfastSpecial}</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
              <span className="text-[10px] font-bold text-orange-700 uppercase block">Lunch Gala Feast</span>
              <p className="text-slate-800 font-medium mt-0.5">{festivalData.lunchSpecial}</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">Celebration Dinner</span>
              <p className="text-slate-800 font-medium mt-0.5">{festivalData.dinnerFeast}</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. QUICK ADD DISH MODAL DIALOG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Add Dish to Campus Menu</h3>
                  <p className="text-[10px] text-slate-400">Instantly visible on all student phones</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddDish(modalDay, modalMeal, modalDishName);
              }}
              className="space-y-3.5"
            >
              {/* Day Selection */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Day of the Week
                </label>
                <select
                  value={modalDay}
                  onChange={(e) => setModalDay(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-semibold"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d} {d === todayDayName ? '(Today)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meal Slot Selection */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Meal Slot
                </label>
                <select
                  value={modalMeal}
                  onChange={(e) => setModalMeal(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-semibold"
                >
                  <option value="BREAKFAST">🌅 Breakfast (07:30 AM - 09:30 AM)</option>
                  <option value="LUNCH">☀️ Lunch (12:30 PM - 02:30 PM)</option>
                  <option value="SNACKS">☕ Evening Snacks (05:00 PM - 06:30 PM)</option>
                  <option value="DINNER">🌙 Dinner (08:00 PM - 10:00 PM)</option>
                </select>
              </div>

              {/* Dish Name Input */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Dish / Food Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kadhai Paneer, Hot Veg Momos, Kesar Kulfi..."
                  value={modalDishName}
                  onChange={(e) => setModalDishName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {/* Dietary Category */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase mb-1">
                  Dietary Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'VEG', label: 'Pure Veg 🟢' },
                    { key: 'NON_VEG', label: 'Egg / Non-Veg 🔴' },
                    { key: 'SPECIAL', label: 'Special Treat 🌟' },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setModalDietary(cat.key)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center ${
                        modalDietary === cat.key
                          ? 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!modalDishName.trim() || submittingModal}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-amber-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {submittingModal ? 'Publishing...' : 'Save & Broadcast to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
