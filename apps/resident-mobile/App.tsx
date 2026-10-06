import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  ShieldAlert,
  Wrench,
  QrCode,
  Calendar,
  Users,
  Car,
  Utensils,
  PhoneCall,
  Bell,
  HeartPulse,
  Flame,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react-native';

const API_BASE = 'http://10.0.2.2:4000/api'; // Standard Android emulator loopback or localhost

export default function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PASSES' | 'COMPLAINTS' | 'MENU'>('HOME');
  const [showSosModal, setShowSosModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<{ title: string; token: string } | null>(null);

  // User Profile
  const user = {
    name: 'Rahul Sharma',
    room: 'A-204',
    block: 'Nilgiri Block A (Boys)',
    studentId: 'CS2023-089',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120'
  };

  // State
  const [complaintCategory, setComplaintCategory] = useState('WATER');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [passType, setPassType] = useState('GATE_PASS');
  const [passDestination, setPassDestination] = useState('Sector 18 Market');
  const [isEatingTonight, setIsEatingTonight] = useState(true);

  const activePass = {
    passNumber: 'PASS-892101',
    passType: 'GATE_PASS',
    destination: 'Sector 18 Market',
    validTill: '20:30 PM',
    status: 'APPROVED',
    token: 'QR-PASS-892101-RAHUL'
  };

  const triggerSos = (type: string) => {
    Alert.alert(
      '🚨 SOS ALARM BROADCASTED',
      `${type} Emergency Alarm sent to Warden, Chief Security Officer & Campus Ambulance with your room location (Room ${user.room}). Help is en route!`,
      [{ text: 'OK', onPress: () => setShowSosModal(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <Text style={styles.userRoom}>
              Room {user.room} • {user.block}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Active Pass Banner */}
      <TouchableOpacity
        style={styles.activePassBanner}
        onPress={() =>
          setShowQrModal({
            title: 'Approved Gate Pass QR',
            token: activePass.token
          })
        }
      >
        <View style={styles.bannerIcon}>
          <QrCode size={20} color="#FFFFFF" />
        </View>
        <View style={styles.bannerInfo}>
          <Text style={styles.bannerTitle}>GATE PASS APPROVED</Text>
          <Text style={styles.bannerSubtitle}>Tap to scan at Turnstile Gate (Till {activePass.validTill})</Text>
        </View>
        <ChevronRight size={18} color="#D1FAE5" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Action Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>2-3 Taps Only</Text>
          </View>

          <View style={styles.grid}>
            {/* Complaint */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => setShowComplaintModal(true)}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#DBEAFE' }]}>
                <Wrench size={22} color="#2563EB" />
              </View>
              <Text style={styles.tileLabel}>Complaint</Text>
            </TouchableOpacity>

            {/* Gate Pass */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => {
                setPassType('GATE_PASS');
                setShowPassModal(true);
              }}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#D1FAE5' }]}>
                <QrCode size={22} color="#059669" />
              </View>
              <Text style={styles.tileLabel}>Gate Pass</Text>
            </TouchableOpacity>

            {/* Leave */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => {
                setPassType('LEAVE');
                setShowPassModal(true);
              }}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#F3E8FF' }]}>
                <Calendar size={22} color="#9333EA" />
              </View>
              <Text style={styles.tileLabel}>Leave</Text>
            </TouchableOpacity>

            {/* Visitors */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => Alert.alert('Visitor Pre-Approval', 'Pre-approve guests and generate OTP digital pass.')}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#FEF3C7' }]}>
                <Users size={22} color="#D97706" />
              </View>
              <Text style={styles.tileLabel}>Visitor</Text>
            </TouchableOpacity>

            {/* Vehicle */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() =>
                setShowQrModal({
                  title: 'Vehicle Parking Digital Pass',
                  token: 'VEH-UP16BV4492-PASS'
                })
              }
            >
              <View style={[styles.tileIcon, { backgroundColor: '#E0E7FF' }]}>
                <Car size={22} color="#4F46E5" />
              </View>
              <Text style={styles.tileLabel}>Vehicle</Text>
            </TouchableOpacity>

            {/* Mess Menu */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => setActiveTab('MENU')}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#FFEDD5' }]}>
                <Utensils size={22} color="#EA580C" />
              </View>
              <Text style={styles.tileLabel}>Mess Menu</Text>
            </TouchableOpacity>

            {/* Directory */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => Alert.alert('Campus Directory', 'Warden: +91 98111 00002\nSecurity: +91 98111 00004\nDoctor: 108')}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#E0F2FE' }]}>
                <PhoneCall size={22} color="#0284C7" />
              </View>
              <Text style={styles.tileLabel}>Contacts</Text>
            </TouchableOpacity>

            {/* Notice Board */}
            <TouchableOpacity
              style={styles.tile}
              onPress={() => Alert.alert('Notice Board', 'Annual Sports Meet registration is live. Inter-hostel tournaments start next week.')}
            >
              <View style={[styles.tileIcon, { backgroundColor: '#FFE4E6' }]}>
                <Bell size={22} color="#E11D48" />
              </View>
              <Text style={styles.tileLabel}>Notices</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mess Menu Card */}
        <View style={styles.messCard}>
          <View style={styles.messHeader}>
            <View style={styles.messHeaderLeft}>
              <View style={styles.messIcon}>
                <Utensils size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.messTitle}>TODAY&apos;S MESS MENU</Text>
                <Text style={styles.messSubtitle}>Dinner: 8:00 PM - 10:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.eatingBtn,
                isEatingTonight ? styles.eatingActive : styles.eatingInactive
              ]}
              onPress={() => setIsEatingTonight(!isEatingTonight)}
            >
              <Text style={[styles.eatingText, isEatingTonight && styles.eatingTextActive]}>
                {isEatingTonight ? 'Eating ✓' : 'Skipping ✕'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.messDish}>
            Paneer Butter Masala, Butter Naan, Jeera Rice, Dal Tadka, Gulab Jamun
          </Text>
        </View>

        {/* Active Grievances Snippet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Grievances</Text>
          <View style={styles.complaintCard}>
            <View style={styles.complaintHeader}>
              <Text style={styles.complaintTicket}>CMP-780124 • WATER</Text>
              <Text style={styles.complaintStatus}>IN PROGRESS</Text>
            </View>
            <Text style={styles.complaintTitle}>
              Low water pressure in 2nd floor bathroom
            </Text>
            <Text style={styles.complaintSub}>
              Assigned to: Plumber Mahendra Singh • SLA: 4 hrs
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Persistent Floating SOS Button */}
      <TouchableOpacity
        style={styles.sosFab}
        onPress={() => setShowSosModal(true)}
      >
        <ShieldAlert size={22} color="#FFFFFF" />
        <Text style={styles.sosText}>SOS EMERGENCY</Text>
      </TouchableOpacity>

      {/* SOS Modal */}
      <Modal visible={showSosModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.sosModalContent}>
            <View style={styles.sosModalHeader}>
              <AlertTriangle size={24} color="#DC2626" />
              <Text style={styles.sosModalTitle}>CONFIRM EMERGENCY</Text>
            </View>
            <Text style={styles.sosModalDesc}>
              Instantly transmits location (Room {user.room}) and triggers audio siren at Warden & Security desk.
            </Text>

            <View style={styles.sosGrid}>
              <TouchableOpacity
                style={[styles.sosButton, { borderColor: '#EF4444' }]}
                onPress={() => triggerSos('MEDICAL')}
              >
                <HeartPulse size={30} color="#DC2626" />
                <Text style={styles.sosButtonTitle}>Medical</Text>
                <Text style={styles.sosButtonSub}>Ambulance</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sosButton, { borderColor: '#F59E0B' }]}
                onPress={() => triggerSos('FIRE')}
              >
                <Flame size={30} color="#D97706" />
                <Text style={styles.sosButtonTitle}>Fire</Text>
                <Text style={styles.sosButtonSub}>Evacuation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sosButton, { borderColor: '#9333EA' }]}
                onPress={() => triggerSos('SECURITY THREAT')}
              >
                <ShieldAlert size={30} color="#7E22CE" />
                <Text style={styles.sosButtonTitle}>Security</Text>
                <Text style={styles.sosButtonSub}>Threat / Fight</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sosButton, { borderColor: '#64748B' }]}
                onPress={() => triggerSos('OTHER CRISIS')}
              >
                <AlertTriangle size={30} color="#334155" />
                <Text style={styles.sosButtonTitle}>Other</Text>
                <Text style={styles.sosButtonSub}>Urgent Help</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowSosModal(false)}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Display Modal */}
      <Modal visible={!!showQrModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalContent}>
            <Text style={styles.qrModalTitle}>{showQrModal?.title}</Text>
            <View style={styles.qrContainer}>
              {showQrModal?.token && (
                <QRCode value={showQrModal.token} size={180} />
              )}
            </View>
            <Text style={styles.qrTokenText}>{showQrModal?.token}</Text>
            <Text style={styles.qrInstruction}>
              Hold towards turnstile optical scanner at campus gate
            </Text>
            <TouchableOpacity
              style={styles.qrCloseBtn}
              onPress={() => setShowQrModal(null)}
            >
              <Text style={styles.qrCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2-Click Complaint Modal */}
      <Modal visible={showComplaintModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.complaintModalContent}>
            <Text style={styles.complaintModalTitle}>2-Click Quick Complaint</Text>
            <Text style={styles.inputLabel}>Step 1: Select Category</Text>
            <View style={styles.categoryRow}>
              {['WATER', 'ELECTRICITY', 'WIFI', 'CLEANING'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    complaintCategory === cat && styles.catChipActive
                  ]}
                  onPress={() => setComplaintCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      complaintCategory === cat && styles.catChipTextActive
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Step 2: Issue Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Geyser trip switch not resetting"
              value={complaintTitle}
              onChangeText={setComplaintTitle}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                Alert.alert('Complaint Queued', 'Ticket CMP-780130 raised with 4-hr SLA.');
                setShowComplaintModal(false);
                setComplaintTitle('');
              }}
            >
              <Text style={styles.submitBtnText}>Submit to Department</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Gate Pass Modal */}
      <Modal visible={showPassModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.complaintModalContent}>
            <Text style={styles.complaintModalTitle}>Request Digital Gate Pass</Text>
            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={styles.textInput}
              value={passDestination}
              onChangeText={setPassDestination}
              placeholder="Market / Library"
            />
            <Text style={styles.passNote}>
              Gate passes under 2 hours are auto-approved. Return time verified at turnstile.
            </Text>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                Alert.alert('Gate Pass Active', 'QR Token generated. Show to turnstile scanner.');
                setShowPassModal(false);
              }}
            >
              <Text style={styles.submitBtnText}>Generate Pass QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6
  },
  verifiedText: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '700'
  },
  userRoom: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 2
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activePassBanner: {
    backgroundColor: '#059669',
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  bannerInfo: {
    flex: 1
  },
  bannerTitle: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  section: {
    marginBottom: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B'
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  tile: {
    width: (width - 48) / 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155'
  },
  messCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 22,
    padding: 14,
    marginBottom: 20
  },
  messHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  messHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  messIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  messTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A3412'
  },
  messSubtitle: {
    fontSize: 10,
    color: '#7C2D12'
  },
  eatingBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1
  },
  eatingActive: {
    backgroundColor: '#059669',
    borderColor: '#059669'
  },
  eatingInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1'
  },
  eatingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  eatingTextActive: {
    color: '#FFFFFF'
  },
  messDish: {
    fontSize: 12,
    fontWeight: '600',
    color: '#431407'
  },
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 12
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  complaintTicket: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB'
  },
  complaintStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706'
  },
  complaintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2
  },
  complaintSub: {
    fontSize: 11,
    color: '#64748B'
  },
  sosFab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.8,
    marginLeft: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  sosModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  sosModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  sosModalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626',
    marginLeft: 8
  },
  sosModalDesc: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 18
  },
  sosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  sosButton: {
    width: (width - 56) / 2,
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8FAFC'
  },
  sosButtonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6
  },
  sosButtonSub: {
    fontSize: 10,
    color: '#64748B'
  },
  closeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B'
  },
  qrModalContent: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center'
  },
  qrModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  qrTokenText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6
  },
  qrInstruction: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16
  },
  qrCloseBtn: {
    backgroundColor: '#0F172A',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center'
  },
  qrCloseText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  complaintModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20
  },
  complaintModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  catChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  catChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569'
  },
  catChipTextActive: {
    color: '#FFFFFF'
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: '#0F172A',
    marginBottom: 14
  },
  passNote: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 14
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
