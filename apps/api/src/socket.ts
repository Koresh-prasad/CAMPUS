import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@shms/shared';

let io: SocketIOServer | null = null;

export function initSocketServer(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  });

  io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    socket.on('join_role_room', (role: string) => {
      socket.join(`role:${role}`);
      console.log(`[WebSocket] ${socket.id} joined room role:${role}`);
    });

    socket.on('join_resident_room', (residentId: string) => {
      socket.join(`resident:${residentId}`);
      console.log(`[WebSocket] ${socket.id} joined room resident:${residentId}`);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function broadcastEmergency(data: any) {
  if (!io) return;
  console.log('[WebSocket Alert] Broadcasting emergency siren to all admin & security clients');
  io.emit(SOCKET_EVENTS.EMERGENCY_TRIGGERED, data);
  io.emit('emergency:triggered', data);
  io.emit('emergency:sos', data);
  io.emit('notification:new', {
    id: `notif-em-${Date.now()}`,
    title: `🚨 EMERGENCY SOS: ${data.emergencyType || 'CRITICAL ALERT'}`,
    message: `${data.residentName || 'Student'} triggered SOS at ${data.locationDetails || 'Campus'}!`,
    type: 'EMERGENCY',
    timestamp: new Date().toISOString(),
    data
  });
}

export function broadcastEmergencyResolved(data: any) {
  if (!io) return;
  io.emit(SOCKET_EVENTS.EMERGENCY_RESOLVED, data);
  io.emit('emergency:resolved', data);
}

export function broadcastCurfewAlert(data: any) {
  if (!io) return;
  io.emit(SOCKET_EVENTS.CURFEW_ALERT, data);
  io.emit('curfew:alert', data);
}

export function broadcastVisitorOverstay(data: any) {
  if (!io) return;
  io.emit(SOCKET_EVENTS.VISITOR_OVERSTAY_ALERT, data);
  io.emit('visitor:overstay', data);
}

export function broadcastPassUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket Alert] Broadcasting pass update:', data.passNumber || data.passId || data.id);
  io.emit(SOCKET_EVENTS.PASS_STATUS_UPDATE, data);
  io.emit('pass:requested', data);
  io.emit('pass:created', data);
  io.emit('pass:status_update', data);
  io.emit('notification:new', {
    id: `notif-pass-${Date.now()}`,
    title: `🚪 Gate Pass / Leave: ${data.studentName || 'Student'}`,
    message: `${data.passType || 'Pass'} applied for ${data.destination || 'outing'} (${data.roomNumber || 'Room'})`,
    type: 'PASS',
    passNumber: data.passNumber,
    timestamp: new Date().toISOString(),
    data
  });
}

export function broadcastComplaintUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket Alert] Broadcasting complaint / query / medical update:', data.ticketNumber);
  io.emit(SOCKET_EVENTS.COMPLAINT_UPDATE, data);
  io.emit('complaint:update', data);
  io.emit('complaint:created', data);
  io.emit('complaint:raised', data);

  const catUpper = String(data.category || '').toUpperCase();
  const isMedical = catUpper.includes('MEDIC');
  const isQuery = catUpper.includes('QUERY') || catUpper.includes('ACADEMIC') || catUpper.includes('HELPDESK');

  if (isMedical) {
    io.emit('medical:request_created', data);
    io.emit('medical:update', data);
  }

  if (isQuery) {
    io.emit('query:created', data);
  }

  const notificationCategory =
    data.priority === 'CRITICAL' || data.priority === 'EMERGENCY'
      ? 'RED_URGENT'
      : data.priority === 'HIGH'
      ? 'ORANGE_HIGH'
      : 'BLUE_NORMAL';

  const title = isMedical
    ? `💊 Student Medical Help: ${data.residentName || 'Student'} (${data.roomNumber || 'Room'})`
    : isQuery
    ? `💬 Student Query #${data.ticketNumber || 'QRY'}: ${data.residentName || 'Student'}`
    : `📝 Grievance #${data.ticketNumber || 'TKT'}: ${data.residentName || 'Student'}`;

  const message = isMedical
    ? `${data.title || data.description || 'Medical help / medicine requested'} [${data.priority || 'Normal'}]`
    : isQuery
    ? `${data.title || data.description || 'Student submitted a query'} (${data.roomNumber || 'Campus'})`
    : `${data.residentName || 'Student'} (${data.roomNumber || 'Room'}) reported [${data.category || 'Grievance'}]: ${data.title || data.description || ''}`;

  const targetTab = isMedical ? 'MEDICAL' : 'GRIEVANCES';

  io.emit('notification:new', {
    id: `notif-cmp-${Date.now()}`,
    title,
    message,
    eventType: isMedical ? 'Medical Help Request' : isQuery ? 'Student Query' : 'Campus Grievance',
    type: isMedical ? 'MEDICAL' : isQuery ? 'QUERY' : 'COMPLAINT',
    category: notificationCategory,
    studentName: data.residentName || 'Student Resident',
    studentId: data.residentId || 'REC-STU',
    location: data.blockName || 'Hostel',
    hostelRoom: data.roomNumber || 'Room',
    priority: data.priority || 'MEDIUM',
    currentStatus: 'NEW',
    requiredAction: isMedical ? 'Provide Medicine / Consult Doctor' : isQuery ? 'Review and Answer Query' : 'Assign Maintenance Staff',
    time: 'Just now',
    ticketNumber: data.ticketNumber,
    read: false,
    targetTab,
    dateGroup: 'TODAY',
    timestamp: new Date().toISOString(),
    data
  });
}

export function broadcastMedicalRequest(data: any) {
  if (!io) return;
  console.log('[WebSocket Alert] Broadcasting medical request:', data.ticketNumber || data.id);
  io.emit('medical:request_created', data);
  io.emit('medical:update', data);
  io.emit('notification:new', {
    id: `notif-med-${Date.now()}`,
    title: `💊 Student Medical Request: ${data.studentName || 'Student'} (${data.room || data.roomNumber || 'Room'})`,
    message: `${data.description || data.symptoms || 'Medicine / help requested'} [${data.urgency || 'Normal'}]`,
    eventType: 'Student Medical Request',
    type: 'MEDICAL',
    category: data.urgency === 'EMERGENCY' ? 'RED_URGENT' : data.urgency === 'URGENT' ? 'ORANGE_HIGH' : 'BLUE_NORMAL',
    studentName: data.studentName || 'Student Patient',
    studentId: data.studentId || 'REC-STU',
    location: data.hostel || 'Campus Hostel',
    hostelRoom: data.room || data.roomNumber || 'Room',
    priority: data.urgency === 'EMERGENCY' ? 'EMERGENCY' : data.urgency === 'URGENT' ? 'HIGH' : 'MEDIUM',
    currentStatus: 'NEW',
    requiredAction: 'Campus Doctor / Pharmacy Consultation',
    time: 'Just now',
    read: false,
    targetTab: 'MEDICAL',
    dateGroup: 'TODAY',
    timestamp: new Date().toISOString(),
    data
  });
}

export function broadcastNotice(data: any) {
  if (!io) return;
  io.emit(SOCKET_EVENTS.NOTICE_PUBLISHED, data);
  io.emit('notice:published', data);
}

export function broadcastStudentRegistration(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting student:registered to admin consoles');
  io.emit('student:registered', data);
  io.emit('student:registration_requested', data);
  io.emit('notification:new', {
    id: `notif-stu-${Date.now()}`,
    title: `👨‍🎓 New Student Admission Request`,
    message: `${data.name || 'Student'} applied for enrollment (${data.course || 'B.Tech'})`,
    type: 'ADMISSION',
    timestamp: new Date().toISOString(),
    data
  });
}

export function broadcastStudentApproval(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting student:approved to client devices');
  io.emit('student:approved', data);
}

export function broadcastStaffRegistration(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting staff:registered to admin consoles');
  io.emit('staff:registered', data);
  io.emit('staff:registration_requested', data);
}

export function broadcastStaffApproval(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting staff:approved to client devices');
  io.emit('staff:approved', data);
}

export function broadcastMenuUpdate(data: any) {
  if (!io) return;
  io.emit('menu:updated', data);
}

export function broadcastGalleryUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting gallery:updated to all client devices');
  io.emit('gallery:updated', data);
}

export function broadcastCalendarUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting calendar:updated to all client devices');
  io.emit('calendar:updated', data);
}

export function broadcastManagerProfileUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting manager:updated to all client devices');
  io.emit('manager:updated', data);
}

export function broadcastCampusMapUpdate(data: any) {
  if (!io) return;
  console.log('[WebSocket] Broadcasting campus_map:updated to all client devices');
  io.emit('campus_map:updated', data);
}

