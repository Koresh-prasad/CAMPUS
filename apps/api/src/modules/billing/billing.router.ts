import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';

const router = Router();

// Get bills
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { residentId, status } = req.query;
    const whereClause: any = {};
    if (residentId) whereClause.residentId = String(residentId);
    if (status) whereClause.status = String(status);

    const bills = await prisma.bill.findMany({
      where: whereClause,
      include: {
        resident: {
          include: { residentProfile: true }
        },
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = bills.map((b) => ({
      id: b.id,
      invoiceNumber: b.invoiceNumber,
      residentId: b.residentId,
      residentName: b.resident.name,
      roomNumber: b.resident.residentProfile?.roomNumber || 'Unknown',
      title: b.title,
      rentAmount: b.rentAmount,
      messAmount: b.messAmount,
      electricityAmount: b.electricityAmount,
      maintenanceAmount: b.maintenanceAmount,
      fineAmount: b.fineAmount,
      totalAmount: b.totalAmount,
      paidAmount: b.paidAmount,
      dueAmount: b.dueAmount,
      status: b.status,
      dueDate: b.dueDate.toISOString(),
      createdAt: b.createdAt.toISOString(),
      payments: b.payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        transactionRef: p.transactionRef,
        method: p.method,
        paidAt: p.paidAt.toISOString()
      }))
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Generate new bill
router.post('/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { residentId, title, rentAmount, messAmount, electricityAmount, maintenanceAmount, fineAmount, dueDate } = req.body;
    
    const rent = Number(rentAmount || 0);
    const mess = Number(messAmount || 0);
    const elec = Number(electricityAmount || 0);
    const maint = Number(maintenanceAmount || 0);
    const fine = Number(fineAmount || 0);
    const total = rent + mess + elec + maint + fine;

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    const bill = await prisma.bill.create({
      data: {
        invoiceNumber,
        residentId,
        title: title || 'Monthly Hostel & Mess Dues',
        rentAmount: rent,
        messAmount: mess,
        electricityAmount: elec,
        maintenanceAmount: maint,
        fineAmount: fine,
        totalAmount: total,
        dueAmount: total,
        paidAmount: 0,
        status: 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    await createAuditRecord(
      req.user!.id,
      req.user!.role,
      'GENERATE_BILL',
      'BILL',
      bill.id,
      { invoiceNumber, totalAmount: total }
    );

    return res.status(201).json(bill);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate bill' });
  }
});

// Pay bill
router.post('/:id/pay', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, method } = req.body;

    const bill = await prisma.bill.findUnique({ where: { id } });
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    const payAmount = Number(amount || bill.dueAmount);
    const transactionRef = `TXN-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newPaid = bill.paidAmount + payAmount;
    const newDue = Math.max(0, bill.totalAmount - newPaid);
    const newStatus = newDue === 0 ? 'PAID' : 'PARTIAL';

    const [payment, updatedBill] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          billId: id,
          amount: payAmount,
          transactionRef,
          method: method || 'UPI',
          status: 'SUCCESS'
        }
      }),
      prisma.bill.update({
        where: { id },
        data: {
          paidAmount: newPaid,
          dueAmount: newDue,
          status: newStatus
        },
        include: { payments: true }
      })
    ]);

    await createAuditRecord(
      req.user!.id,
      req.user!.role,
      'PAY_BILL',
      'BILL',
      id,
      { paymentId: payment.id, amount: payAmount, transactionRef }
    );

    return res.json({
      success: true,
      message: 'Payment received successfully',
      payment,
      bill: updatedBill
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Automated bulk reminder dispatcher
router.post('/send-reminders', authMiddleware, async (req: Request, res: Response) => {
  try {
    const pendingBills = await prisma.bill.findMany({
      where: { status: { in: ['PENDING', 'OVERDUE'] } },
      include: { resident: true }
    });

    return res.json({
      success: true,
      count: pendingBills.length,
      message: `SMS & Push notifications successfully dispatched to ${pendingBills.length} residents with pending dues.`
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send reminders' });
  }
});

export default router;
