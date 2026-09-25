// Seed data so there is always something to display
const ticketStore = [
    {
        id: 'TCK-FRN-901',
        tenantId: '5a668fdf-a157-47ff-8403-eea57883feee',
        subject: 'Royalty Invoice Clarification for August 2026',
        category: 'Royalty Billing',
        priority: 'High',
        status: 'Open',
        submittedBy: 'Er. Aditya',
        submittedByEmail: 'adityapandey9977@gmail.com',
        description: 'Requesting clarification on GST tax calculation for master royalty fee.',
        attachmentName: 'Royalty_Query_Aug.pdf',
        createdAt: '2026-08-07T10:00:00.000Z',
        updatedAt: '2026-08-07T10:00:00.000Z',
    },
    {
        id: 'TCK-FRN-882',
        tenantId: '5a668fdf-a157-47ff-8403-eea57883feee',
        subject: 'Request for Additional Keratin Treatment Kits',
        category: 'Inventory Supply',
        priority: 'Medium',
        status: 'In Progress',
        submittedBy: 'Er. Aditya',
        submittedByEmail: 'adityapandey9977@gmail.com',
        description: 'Order requisition for 15 units of Schwarzkopf Keratin Mask for Arera Colony Outlet.',
        attachmentName: 'Stock_Requisition_Order.pdf',
        createdAt: '2026-08-02T09:30:00.000Z',
        updatedAt: '2026-08-04T14:20:00.000Z',
    },
    {
        id: 'TCK-FRN-850',
        tenantId: '5a668fdf-a157-47ff-8403-eea57883feee',
        subject: 'MP Nagar Branch Marketing Banner Request',
        category: 'Marketing Assets',
        priority: 'Low',
        status: 'Resolved',
        submittedBy: 'Er. Aditya',
        submittedByEmail: 'adityapandey9977@gmail.com',
        description: 'Request for high-resolution storefront promotional vector files.',
        attachmentName: 'Banner_Dimensions_Design.png',
        createdAt: '2026-07-25T08:00:00.000Z',
        updatedAt: '2026-07-27T11:00:00.000Z',
        resolvedAt: '2026-07-27T11:00:00.000Z',
    },
];
let ticketCounter = 950;
function generateTicketId() {
    ticketCounter += Math.floor(Math.random() * 5) + 1;
    return `TCK-FRN-${ticketCounter}`;
}
// ---------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------
export class SupportController {
    /** GET /api/v1/support/tickets */
    static listTickets(req, res, next) {
        try {
            const { tenantId, status, priority, category } = req.query;
            let results = [...ticketStore];
            // Filter by tenantId extracted from query or JWT header x-tenant-id
            const resolvedTenantId = tenantId || req.headers['x-tenant-id'];
            if (resolvedTenantId) {
                results = results.filter((t) => t.tenantId === resolvedTenantId);
            }
            if (status)
                results = results.filter((t) => t.status === status);
            if (priority)
                results = results.filter((t) => t.priority === priority);
            if (category)
                results = results.filter((t) => t.category === category);
            // Sort newest first
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            res.json({
                success: true,
                data: results,
                pagination: { page: 1, limit: results.length, total: results.length, totalPages: 1 },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    /** GET /api/v1/support/tickets/:id */
    static getTicket(req, res, next) {
        try {
            const ticket = ticketStore.find((t) => t.id === req.params.id);
            if (!ticket) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: `Ticket ${req.params.id} not found` },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            res.json({ success: true, data: ticket, timestamp: new Date().toISOString() });
        }
        catch (err) {
            next(err);
        }
    }
    /** POST /api/v1/support/tickets */
    static createTicket(req, res, next) {
        try {
            const { tenantId, submittedBy, submittedByEmail, subject, category, priority, description, attachmentName, } = req.body;
            if (!subject || !description) {
                res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'subject and description are required' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const now = new Date().toISOString();
            const ticket = {
                id: generateTicketId(),
                tenantId: tenantId || req.headers['x-tenant-id'] || 'unknown',
                submittedBy: submittedBy || 'Franchise Partner',
                submittedByEmail: submittedByEmail || 'unknown@example.com',
                subject,
                category: category || 'General',
                priority: priority || 'Medium',
                description,
                attachmentName: attachmentName || null,
                status: 'Open',
                createdAt: now,
                updatedAt: now,
            };
            ticketStore.unshift(ticket);
            res.status(201).json({ success: true, data: ticket, timestamp: now });
        }
        catch (err) {
            next(err);
        }
    }
    /** PATCH /api/v1/support/tickets/:id/status */
    static updateTicketStatus(req, res, next) {
        try {
            const idx = ticketStore.findIndex((t) => t.id === req.params.id);
            if (idx === -1) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: `Ticket ${req.params.id} not found` },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const { status } = req.body;
            if (!status) {
                res.status(400).json({
                    success: false,
                    error: { code: 'VALIDATION_ERROR', message: 'status is required' },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const now = new Date().toISOString();
            ticketStore[idx] = {
                ...ticketStore[idx],
                status,
                updatedAt: now,
                resolvedAt: status === 'Resolved' || status === 'Closed' ? now : ticketStore[idx].resolvedAt,
            };
            res.json({ success: true, data: ticketStore[idx], timestamp: now });
        }
        catch (err) {
            next(err);
        }
    }
    /** DELETE /api/v1/support/tickets/:id */
    static deleteTicket(req, res, next) {
        try {
            const idx = ticketStore.findIndex((t) => t.id === req.params.id);
            if (idx === -1) {
                res.status(404).json({
                    success: false,
                    error: { code: 'NOT_FOUND', message: `Ticket ${req.params.id} not found` },
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            ticketStore.splice(idx, 1);
            res.json({ success: true, data: { deleted: true }, timestamp: new Date().toISOString() });
        }
        catch (err) {
            next(err);
        }
    }
}
