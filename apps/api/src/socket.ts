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
  console.log('[WebSocket Alert] Broadcasting complaint update:', data.ticketNumber);
  io.emit(SOCKET_EVENTS.COMPLAINT_UPDATE, data);
  io.emit('complaint:update', data);
  io.emit('complaint:created', data);
  io.emit('complaint:raised', data);
  io.emit('notification:new', {
    id: `notif-cmp-${Date.now()}`,
    title: `📝 New Grievance #${data.ticketNumber || 'TKT'}`,
    message: `${data.residentName || 'Student'} (${data.roomNumber || 'Room'}) reported [${data.category || 'Grievance'}]`,
    type: 'COMPLAINT',
    ticketNumber: data.ticketNumber,
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

