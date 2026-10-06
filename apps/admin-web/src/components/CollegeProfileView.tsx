'use client';

import React, { useState, useEffect } from 'react';
import {
  Building,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Award,
  Users,
  CheckCircle2,
  FileText,
  Upload,
  Play,
  Video,
  Trash2,
  Plus,
  Sparkles,
  X,
  Eye,
  Image as ImageIcon,
  Film,
  ZoomIn,
} from 'lucide-react';
import { io } from 'socket.io-client';

interface CollegeProfileProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export default function CollegeProfileView({
  activeSubTab,
  setActiveSubTab,
}: CollegeProfileProps) {
  const subTabs = [
    'College Name',
    'College Logo',
    'Campus Photos & Videos',
    'Campus Map & Master Plan',
    'Address',
    'Phone Numbers',
    'Email',
    'Website',
    'About College',
    'Departments',
    'Principal / Director',
    'Important Information',
  ];

  const currentTab = activeSubTab || 'College Name';

  // Campus Map State
  const [campusMapData, setCampusMapData] = useState<any>(null);
  const [mapTitle, setMapTitle] = useState('REC Autonomous Campus Master Blueprint');
  const [mapDescription, setMapDescription] = useState('185 Acres lush green eco-friendly smart campus on NH-16 Bhubaneswar.');
  const [mapImageUrl, setMapImageUrl] = useState('/images/rec-building.jpg');
  const [uploadingMap, setUploadingMap] = useState(false);
  const [savingMap, setSavingMap] = useState(false);
  const [mapSuccessMsg, setMapSuccessMsg] = useState('');

  // Gallery Management State (Photos & Videos)
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('ALL');
  const [galleryTypeFilter, setGalleryTypeFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [previewMediaModal, setPreviewMediaModal] = useState<{ type: 'PHOTO' | 'VIDEO'; url: string; title: string } | null>(null);

  // New Media Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'ACTIVITIES' | 'CULTURAL' | 'SPORTS' | 'TECH' | 'HOSTEL_LIFE' | 'ACADEMIC'>('ACTIVITIES');
  const [newMediaType, setNewMediaType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [uploadingGalleryFile, setUploadingGalleryFile] = useState(false);
  const [savingGalleryItem, setSavingGalleryItem] = useState(false);
  const [gallerySuccessMsg, setGallerySuccessMsg] = useState('');

  // Fetch live campus map on mount
  useEffect(() => {
    fetch('/api/campus-map')
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) {
          setCampusMapData(d.data);
          if (d.data.title) setMapTitle(d.data.title);
          if (d.data.description) setMapDescription(d.data.description);
          if (d.data.mapImageUrl) setMapImageUrl(d.data.mapImageUrl);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch Gallery Items
  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const d = await res.json();
        setGalleryItems(d.items || []);
      }
    } catch (e) {
      console.error('Error fetching gallery in admin:', e);
    }
  };

  useEffect(() => {
    fetchGallery();
    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');
    socket.on('gallery:updated', () => {
      fetchGallery();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle Gallery File Select (Both Photo and Video)
  const handleGalleryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setNewMediaType('VIDEO');
    } else {
      setNewMediaType('PHOTO');
    }

    setUploadingGalleryFile(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewMediaUrl(ev.target?.result as string);
      setUploadingGalleryFile(false);
    };
    reader.onerror = () => {
      alert('Failed to read media file');
      setUploadingGalleryFile(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Publish Gallery Item to Backend & Broadcast to Students
  const handlePublishGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMediaUrl.trim()) {
      alert('Please provide a title and media file/URL.');
      return;
    }
    setSavingGalleryItem(true);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          mediaType: newMediaType,
          mediaUrl: newMediaUrl,
          thumbnailUrl: newMediaType === 'PHOTO' ? newMediaUrl : undefined,
          description: newDescription.trim(),
          eventDate: newEventDate,
          isPinned: newIsPinned,
          uploadedBy: 'Admin Manager',
        }),
      });

      if (res.ok) {
        setGallerySuccessMsg('✓ Campus media successfully published & broadcast to all student resident platforms!');
        setTimeout(() => setGallerySuccessMsg(''), 5000);
        setShowAddMediaModal(false);
        setNewTitle('');
        setNewMediaUrl('');
        setNewDescription('');
        fetchGallery();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to publish gallery media');
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      alert('Network error publishing gallery media');
    } finally {
      setSavingGalleryItem(false);
    }
  };

  // Handle Delete Gallery Item
  const handleDeleteGalleryItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the college gallery?`)) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        setGallerySuccessMsg(`✓ Removed "${title}" from gallery.`);
        setTimeout(() => setGallerySuccessMsg(''), 4000);
      } else {
        alert('Failed to delete gallery item');
      }
    } catch (e) {
      console.error('Delete gallery error:', e);
    }
  };

  // Handle Map File Upload
  const handleMapFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMap(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMapImageUrl(ev.target?.result as string);
      setUploadingMap(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setUploadingMap(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Save & Publish Map to Student App
  const handlePublishCampusMap = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMap(true);
    try {
      const res = await fetch('/api/campus-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mapTitle,
          description: mapDescription,
          mapImageUrl,
          zones: campusMapData?.zones || undefined,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setCampusMapData(result.data);
        setMapSuccessMsg('✓ Campus Map successfully updated and broadcast to all student resident devices in real-time!');
        setTimeout(() => setMapSuccessMsg(''), 5000);
      } else {
        alert('Failed to save campus map.');
      }
    } catch (err) {
      console.error('Error saving campus map:', err);
      alert('Network error connecting to campus map service.');
    } finally {
      setSavingMap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-3 bg-white p-3 rounded-2xl shadow-2xs">
        {subTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === tab
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. COLLEGE NAME */}
      {currentTab === 'College Name' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Institution Identity</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <p className="text-slate-500">Official Registered Name:</p>
            <h2 className="text-xl font-black text-slate-900">Raajdhani Engineering College (Autonomous)</h2>
            <p className="text-slate-600">Short Code: <strong>REC-BBSR</strong> &nbsp;|&nbsp; College Code: <strong>119</strong></p>
          </div>
        </div>
      )}

      {/* 2. COLLEGE LOGO */}
      {currentTab === 'College Logo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Official Insignia & Brand Assets</h3>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Campus Helper Verified Badge</p>
              <p className="text-[11px] text-slate-400">High-resolution vector insignia used across reports & passes.</p>
              <button
                type="button"
                onClick={() => alert('Logo upload dialog')}
                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
              >
                Upload New Emblem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CAMPUS PHOTOS & VIDEOS (GALLERY MANAGER) */}
      {(currentTab === 'Campus Photos' || currentTab === 'Campus Photos & Videos') && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <Camera className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-black text-white">Campus Media Gallery Manager</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Syncs Live to Student Portal
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Upload official photos and videos of campus festivals, sports tournaments, technical events, and hostel life. All media published here instantly appears in the student platform gallery in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMediaModal(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload Photo or Video</span>
              </button>
            </div>

            {gallerySuccessMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-2xl text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{gallerySuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'PHOTO', 'VIDEO'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setGalleryTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    galleryTypeFilter === t
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'ALL' && 'All Media'}
                  {t === 'PHOTO' && '📷 Photos Only'}
                  {t === 'VIDEO' && '🎬 Videos Only'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Category:</span>
              <select
                value={galleryCategoryFilter}
                onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="ALL">All Categories</option>
                <option value="CULTURAL">Tarang Cultural Fest</option>
                <option value="SPORTS">Sports & Tournaments</option>
                <option value="TECH">Hackathons & Tech</option>
                <option value="HOSTEL_LIFE">Hostel Life & Carnivals</option>
                <option value="ACTIVITIES">Student Activities</option>
                <option value="ACADEMIC">Academic & Seminars</option>
              </select>
            </div>
          </div>

          {/* Media Grid */}
          {galleryItems
            .filter((item) => {
              if (galleryTypeFilter !== 'ALL' && item.mediaType !== galleryTypeFilter) return false;
              if (galleryCategoryFilter !== 'ALL' && item.category !== galleryCategoryFilter) return false;
              return true;
            })
            .length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <Camera className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No media found for the selected filter.</p>
              <button
                type="button"
                onClick={() => setShowAddMediaModal(true)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Upload the first photo or video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {galleryItems
                .filter((item) => {
                  if (galleryTypeFilter !== 'ALL' && item.mediaType !== galleryTypeFilter) return false;
                  if (galleryCategoryFilter !== 'ALL' && item.category !== galleryCategoryFilter) return false;
                  return true;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Media Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        {item.mediaType === 'VIDEO' ? (
                          <>
                            <video
                              src={item.mediaUrl}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewMediaModal({
                                    type: 'VIDEO',
                                    url: item.mediaUrl,
                                    title: item.title,
                                  })
                                }
                                className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer"
                              >
                                <Play className="w-6 h-6 fill-white ml-0.5" />
                              </button>
                            </div>
                            <span className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              <Film className="w-3 h-3 text-purple-400" />
                              <span>HD Video</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewMediaModal({
                                    type: 'PHOTO',
                                    url: item.mediaUrl,
                                    title: item.title,
                                  })
                                }
                                className="p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                              >
                                <ZoomIn className="w-5 h-5" />
                              </button>
                            </div>
                            <span className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                              <ImageIcon className="w-3 h-3 text-blue-400" />
                              <span>Photo</span>
                            </span>
                          </>
                        )}

                        {item.isPinned && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black uppercase">
                            Pinned
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {item.category}
                          </span>
                          <span className="text-slate-400 font-medium">
                            {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description || 'Campus community activity'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                      <span className="text-[10px] text-slate-400">
                        ❤️ {item.likesCount || 0} student likes
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Delete from Gallery"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* UPLOAD MODAL */}
          {showAddMediaModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-black">Upload Official Campus Photo or Video</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddMediaModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handlePublishGalleryItem} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* Media Type Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Media Type:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewMediaType('PHOTO')}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          newMediaType === 'PHOTO'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        📷 Photo / Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewMediaType('VIDEO')}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          newMediaType === 'VIDEO'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        🎬 Video (MP4 / WebM)
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Title:</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Tarang Fest Grand Band Night"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Category:</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                      >
                        <option value="ACTIVITIES">Activities</option>
                        <option value="CULTURAL">Cultural Fest</option>
                        <option value="SPORTS">Sports & Games</option>
                        <option value="TECH">Technical & AI</option>
                        <option value="HOSTEL_LIFE">Hostel Life</option>
                        <option value="ACADEMIC">Academic</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Event Date:</label>
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* File Upload or Direct URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Upload Media File or Enter URL:</label>
                    <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/70 text-center space-y-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleGalleryFileSelect}
                        className="hidden"
                        id="adminGalleryFileInput"
                      />
                      <label
                        htmlFor="adminGalleryFileInput"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose {newMediaType === 'VIDEO' ? 'Video' : 'Photo'} File</span>
                      </label>
                      <p className="text-[10px] text-slate-400">
                        {uploadingGalleryFile ? 'Processing file...' : 'Supports JPG, PNG, WEBP, MP4, WebM'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold">OR Direct Media URL:</p>
                      <input
                        type="url"
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder="https://... or uploaded file preview"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Preview */}
                    {newMediaUrl && (
                      <div className="p-2 border border-slate-200 rounded-xl bg-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-600 font-semibold truncate max-w-xs">
                          {newMediaType === 'VIDEO' ? '🎬 Video Attached' : '📷 Photo Attached'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNewMediaUrl('')}
                          className="text-xs font-bold text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Description:</label>
                    <textarea
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Brief details about this event or celebration..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Pin to Top */}
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newIsPinned}
                      onChange={(e) => setNewIsPinned(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Pin this item to top of Student Gallery</span>
                  </label>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMediaModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingGalleryItem}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
                    >
                      {savingGalleryItem ? 'Publishing...' : 'Publish & Broadcast Live'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* LIGHTBOX / VIDEO PLAYER MODAL */}
          {previewMediaModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    {previewMediaModal.type === 'VIDEO' ? (
                      <Video className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Camera className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-xs font-extrabold">{previewMediaModal.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewMediaModal(null)}
                    className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 flex items-center justify-center bg-black max-h-[75vh]">
                  {previewMediaModal.type === 'VIDEO' ? (
                    <video
                      src={previewMediaModal.url}
                      controls
                      autoPlay
                      className="max-h-[70vh] max-w-full rounded-xl shadow-lg"
                    />
                  ) : (
                    <img
                      src={previewMediaModal.url}
                      alt={previewMediaModal.title}
                      className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CAMPUS MAP & MASTER PLAN MANAGER */}
      {currentTab === 'Campus Map & Master Plan' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-white">Campus Master Plan & Blueprint Manager</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Student Broadcast Active
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Upload or update the official architectural campus map and zone directory. When published, this map is instantly broadcast to all student resident dashboards and mobile portals.
            </p>
          </div>

          {mapSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mapSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Preview on Left */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Current Blueprint Preview
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">185 Acres Campus</span>
                </div>

                <div className="mt-3 relative rounded-2xl overflow-hidden bg-slate-950 min-h-[260px] flex items-center justify-center border border-slate-800">
                  <img
                    src={mapImageUrl || '/images/rec-building.jpg'}
                    alt="Campus Blueprint Preview"
                    className="max-h-[300px] w-full object-contain"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    Preview: {mapTitle}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Total Zones Defined: <strong>{campusMapData?.zones?.length || 9}</strong></span>
                <span className="text-blue-600 font-bold">Synchronized with Student Platform</span>
              </div>
            </div>

            {/* Map Upload & Settings Form on Right */}
            <form onSubmit={handlePublishCampusMap} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Edit & Upload Master Plan
              </h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Blueprint / Map Headline *</label>
                <input
                  type="text"
                  required
                  value={mapTitle}
                  onChange={(e) => setMapTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campus Description & Coordinates</label>
                <textarea
                  rows={2}
                  value={mapDescription}
                  onChange={(e) => setMapDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              {/* Upload Map File */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2">
                <label className="font-bold text-blue-900 block text-xs">
                  Upload New Campus Map File (JPG / PNG / WEBP)
                </label>
                <div className="flex gap-2">
                  <label className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingMap ? 'Loading File...' : 'Choose Image File from PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMapFileUpload}
                    />
                  </label>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold block">Or specify image URL directly:</span>
                  <input
                    type="url"
                    value={mapImageUrl}
                    onChange={(e) => setMapImageUrl(e.target.value)}
                    placeholder="https://... or /images/rec-building.jpg"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px]"
                  />
                </div>
              </div>

              {/* Preset Options */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">1-Click Presets:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setMapImageUrl('/images/rec-building.jpg')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                  >
                    Preset: REC Main Campus
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapImageUrl('/images/campus-bg.png')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                  >
                    Preset: Residential Quadrangle
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={savingMap || uploadingMap}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{savingMap ? 'Publishing to Campus Helper...' : 'Publish Campus Map to Student Platform'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADDRESS */}
      {currentTab === 'Address' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Campus Postal Address</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <p className="font-bold text-slate-900 text-sm">Raajdhani Engineering College Campus</p>
            <p className="text-slate-600">Near Mancheswar Railway Station, PO: Rasulgarh</p>
            <p className="text-slate-600">Bhubaneswar, Khordha, Odisha — 751010, India</p>
            <p className="text-[11px] text-blue-600 pt-1">Coordinates: 20.3235° N, 85.8647° E</p>
          </div>
        </div>
      )}

      {/* 5. PHONE NUMBERS */}
      {currentTab === 'Phone Numbers' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-800 mb-2">College Telephone Directory</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">EPABX Board</strong>
                <p className="text-[10px] text-slate-400">Reception Desk</p>
              </div>
              <span className="font-bold text-blue-600">+91 674 2751017</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Principal Secretariat</strong>
                <p className="text-[10px] text-slate-400">Director Office</p>
              </div>
              <span className="font-bold text-blue-600">+91 674 2751018</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Admissions Helpline</strong>
                <p className="text-[10px] text-slate-400">Counseling Desk</p>
              </div>
              <span className="font-bold text-slate-700">+91 94370 20000</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. EMAIL */}
      {currentTab === 'Email' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-base font-extrabold text-slate-800 mb-2">Official Email Addresses</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-600">General Information:</span>
              <strong className="text-blue-600">info@rec.ac.in</strong>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-600">Principal Office:</span>
              <strong className="text-blue-600">principal@rec.ac.in</strong>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-600">Hostel Administration:</span>
              <strong className="text-blue-600">hostel@rec.ac.in</strong>
            </div>
          </div>
        </div>
      )}

      {/* 7. WEBSITE */}
      {currentTab === 'Website' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Institutional Web Portal</h3>
          <p className="text-xs text-slate-600">
            Official Portal: <a href="https://www.rec.ac.in" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">https://www.rec.ac.in</a>
          </p>
        </div>
      )}

      {/* 8. ABOUT COLLEGE */}
      {currentTab === 'About College' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">About Raajdhani Engineering College</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Established in 2006, Raajdhani Engineering College (Autonomous), Bhubaneswar is a premier autonomous institute of technical education in eastern India. Accredited with Grade 'A' by NAAC and approved by AICTE, REC is an autonomous institution affiliated to Biju Patnaik University of Technology (BPUT), Odisha. The campus spans over 25 lush green acres providing modern classrooms, advanced computing labs, high-speed Wi-Fi, and residential facilities for over 1,800 students.
          </p>
        </div>
      )}

      {/* 9. DEPARTMENTS */}
      {currentTab === 'Departments' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-800">Academic Engineering Branches</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              'Computer Science & Engineering (CSE)',
              'Mechanical Engineering (ME)',
              'Civil Engineering (CE)',
              'Electrical Engineering (EE)',
              'Electronics & Telecommunication (ETC)',
              'Master of Business Administration (MBA)',
            ].map((d, i) => (
              <div key={i} className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-xs font-bold text-slate-800">
                {d}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. PRINCIPAL / DIRECTOR */}
      {currentTab === 'Principal / Director' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Head of the Institution</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              BP
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">Prof. (Dr.) B. K. Patnaik, Ph.D.</h4>
              <p className="text-blue-600 font-bold">Principal & Professor</p>
              <p className="text-slate-500">Ph.D. from IIT Kharagpur with 26+ years of academic & research leadership.</p>
              <p className="text-slate-700">Email: principal@rec.ac.in &nbsp;|&nbsp; Tel: +91 674 2751018</p>
            </div>
          </div>
        </div>
      )}

      {/* 11. IMPORTANT INFORMATION */}
      {currentTab === 'Important Information' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Statutory & Regulatory Accreditations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">NAAC Accreditation</strong>
              <p className="text-slate-500 mt-0.5">Accredited with Grade 'A' (Score: 3.24)</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">AICTE Approval</strong>
              <p className="text-slate-500 mt-0.5">Permanent Institute ID: 1-4241081</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">University Affiliation</strong>
              <p className="text-slate-500 mt-0.5">Biju Patnaik University of Technology (BPUT), Rourkela</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">AISHE Institutional Code</strong>
              <p className="text-slate-500 mt-0.5">C-30124 (MHRD Government of India)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
