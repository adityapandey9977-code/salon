export type NotificationSeverity = 'Critical' | 'Warning' | 'Info' | 'Success';
export type NotificationCategory =
  | 'Inventory & Supply'
  | 'Franchise & Partner'
  | 'Appointments & Operations'
  | 'Staff & Rostering'
  | 'Finance & Royalties'
  | 'Compliance & Security';

export interface NotificationTimelineItem {
  time: string;
  title: string;
  description: string;
  actor: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  summary: string;
  detailedMessage: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  isResolved: boolean;
  branch: string;
  entityType: string;
  entityId: string;
  entityName: string;
  targetLink?: string;
  suggestedActionLabel?: string;
  suggestedActionType?: string;
  timeline: NotificationTimelineItem[];
  metadata?: {
    estimatedImpact?: string;
    affectedCustomers?: number;
    financialValue?: string;
    slaRemaining?: string;
  };
}

export const initialAdminNotifications: AdminNotification[] = [
  {
    id: 'NOTIF-101',
    title: 'Critical Consumable Stockout Exception',
    summary:
      'Safety stock depleted for L’Oréal Majirel 5.0 and Hydra Infusion Serums in Indore & Pune.',
    detailedMessage:
      'Inventory sensors and POS checkout scans report that L’Oréal Majirel 5.0 (0 units remaining) and Hydra Infusion Serum #3 (1 unit remaining) have fallen below the mandatory 5-day safety buffer at Indore Indrapuri Flagship and Pune Koregaon Park. 14 scheduled appointments tomorrow require these specific product SKUs.',
    category: 'Inventory & Supply',
    severity: 'Critical',
    timestamp: '2026-08-25T12:45:00Z',
    timeAgo: '15 mins ago',
    isRead: false,
    isResolved: false,
    branch: 'Indore & Pune Flagships',
    entityType: 'Inventory SKU',
    entityId: 'SKU-5821',
    entityName: 'L’Oréal Majirel 5.0 / Hydra Serum #3',
    targetLink: '/inventory',
    suggestedActionLabel: 'Authorize Emergency Inter-Branch Transfer',
    suggestedActionType: 'TRANSFER_STOCK',
    metadata: {
      estimatedImpact: '14 Appointments at Risk Tomorrow',
      affectedCustomers: 14,
      financialValue: '₹42,500 GMV',
      slaRemaining: '3h 15m before next shift',
    },
    timeline: [
      {
        time: '12:45 PM',
        title: 'Safety Stock Threshold Breached',
        description: 'Auto-scan detected 0 inventory balance at Indrapuri dispensary.',
        actor: 'Inventory Automated Telemetry',
      },
      {
        time: '12:50 PM',
        title: 'Auto-Replenishment Alert Dispatched',
        description: 'Notification triggered to Brand Owner and Central Warehouse Lead.',
        actor: 'Supply Chain Engine',
      },
    ],
  },
  {
    id: 'NOTIF-102',
    title: 'Franchise Statutory Agreement Expiring in 24 Days',
    summary:
      'Gwalior Royal Spa Co. (City Centre Outlet 1) 3-year term agreement expires on 11 Sep 2026.',
    detailedMessage:
      'The 3-Year Master Franchise & Trademark Licensing Agreement for Gwalior Royal Spa Co. (City Centre Outlet 1) is approaching expiry on 11 Sep 2026. The franchise partner has submitted an extension application for a 5-year renewal term with revised 8.5% royalty terms awaiting Brand Owner sign-off.',
    category: 'Franchise & Partner',
    severity: 'Warning',
    timestamp: '2026-08-25T11:30:00Z',
    timeAgo: '1 hour ago',
    isRead: false,
    isResolved: false,
    branch: 'Gwalior City Centre',
    entityType: 'Franchise Partner',
    entityId: 'FP-8803',
    entityName: 'Gwalior Royal Spa Co.',
    targetLink: '/franchise',
    suggestedActionLabel: 'Review & Sign Renewal Addendum',
    suggestedActionType: 'RENEW_AGREEMENT',
    metadata: {
      estimatedImpact: 'Quarterly Royalty at Stake',
      financialValue: '₹14.2L Annual Royalty',
      slaRemaining: '24 Days Remaining',
    },
    timeline: [
      {
        time: '11:30 AM',
        title: '30-Day Expiry Window Opened',
        description: 'Statutory compliance system flagged renewal deadline.',
        actor: 'Franchise Governance Bot',
      },
    ],
  },
  {
    id: 'NOTIF-103',
    title: 'High-Value VIP Client Online Booking',
    summary:
      'Akanksha Sharma (Platinum Luxe Member) booked 7-Step Medical Hydra-Facial & LED Therapy.',
    detailedMessage:
      'VIP Platinum client Akanksha Sharma (Lifetime Value: ₹48,500, 18 Visits) has booked a multi-service package (7-Step Medical Hydra-Facial + LED Therapy) via the Customer Mobile App for Indrapuri Flagship. Preferred specialist Ananya Deshmukh has been reserved.',
    category: 'Appointments & Operations',
    severity: 'Success',
    timestamp: '2026-08-25T10:15:00Z',
    timeAgo: '2 hours ago',
    isRead: false,
    isResolved: false,
    branch: 'Atelier Indrapuri Flagship',
    entityType: 'Appointment',
    entityId: 'APT-4537',
    entityName: 'Akanksha Sharma',
    targetLink: '/operations?tab=appointments',
    suggestedActionLabel: 'Inspect Booking & Room Prep',
    suggestedActionType: 'VIEW_APPOINTMENT',
    metadata: {
      financialValue: '₹9,900 Total Package',
      slaRemaining: '19 Aug 2026 · 11:00 AM',
    },
    timeline: [
      {
        time: '10:15 AM',
        title: 'Mobile App Booking Completed',
        description: 'Client paid ₹2,475 advance token deposit via Razorpay UPI.',
        actor: 'Client Mobile App',
      },
    ],
  },
  {
    id: 'NOTIF-104',
    title: 'Emergency Specialist Leave Escalation',
    summary: 'Senior Nail Artist Kavita Iyer requested medical emergency leave for 26 Aug 2026.',
    detailedMessage:
      'Senior Nail Extensionist Kavita Iyer (Whitefield Studio) has submitted an unscheduled medical leave request for tomorrow. There are 6 nail extension appointments on her roster. Backup nail specialist Pooja Kashyap is available on standby to accept roster reallocation.',
    category: 'Staff & Rostering',
    severity: 'Warning',
    timestamp: '2026-08-25T09:00:00Z',
    timeAgo: '4 hours ago',
    isRead: false,
    isResolved: false,
    branch: 'Atelier Whitefield Studio',
    entityType: 'Staff Member',
    entityId: 'STF-103',
    entityName: 'Kavita Iyer',
    targetLink: '/staff?tab=roster',
    suggestedActionLabel: 'Reassign 6 Bookings to Pooja Kashyap',
    suggestedActionType: 'REASSIGN_SHIFT',
    metadata: {
      affectedCustomers: 6,
      estimatedImpact: '6 Client Appointments Need Reallocation',
      slaRemaining: '5 hours before roster lock',
    },
    timeline: [
      {
        time: '09:00 AM',
        title: 'Leave Application Filed',
        description: 'Medical certificate uploaded and emergency workflow initiated.',
        actor: 'Staff Portal',
      },
    ],
  },
  {
    id: 'NOTIF-105',
    title: 'Outstanding Royalty Settlement Overdue (30+ Days)',
    summary:
      'Radiance Salon Ventures (Bhopal Arera Outlet) has pending royalty fees of ₹60,000 for July 2026.',
    detailedMessage:
      'Radiance Salon Ventures has exceeded the 30-day grace period for July 2026 Brand Royalty settlements. Automatic ACH debit failed due to mandate mismatch. Notice has been delivered to the franchise managing director.',
    category: 'Finance & Royalties',
    severity: 'Critical',
    timestamp: '2026-08-25T08:30:00Z',
    timeAgo: '5 hours ago',
    isRead: true,
    isResolved: false,
    branch: 'Bhopal Arera Luxury Lounge',
    entityType: 'Franchise Partner',
    entityId: 'FP-8804',
    entityName: 'Radiance Salon Ventures',
    targetLink: '/franchise?tab=commissions',
    suggestedActionLabel: 'Generate Payment Link & Formal Notice',
    suggestedActionType: 'SEND_FINANCE_NOTICE',
    metadata: {
      financialValue: '₹60,000 Overdue Royalty',
      slaRemaining: 'Grace Period Overdue',
    },
    timeline: [
      {
        time: '08:30 AM',
        title: 'Settlement Grace Exceeded',
        description: 'Finance billing engine flagged overdue invoice #ROY-2026-07.',
        actor: 'Billing Service',
      },
    ],
  },
  {
    id: 'NOTIF-106',
    title: 'Doorstep Concierge Dispatch Live Tracking',
    summary: 'Specialist Sameer Sheikh en route with Portable Kit #MB-02 for VIP Home Service.',
    detailedMessage:
      'Home Service Concierge specialist Sameer Sheikh has departed fulfilling Indrapuri Flagship hub with Sanitized Mobile Barbering Roll-Case #MB-02. Estimated arrival at Whispering Palms Estate, Arera Colony in 18 minutes.',
    category: 'Appointments & Operations',
    severity: 'Info',
    timestamp: '2026-08-25T07:50:00Z',
    timeAgo: '6 hours ago',
    isRead: true,
    isResolved: true,
    branch: 'Atelier Indrapuri Flagship',
    entityType: 'Home Service Dispatch',
    entityId: 'APT-1892',
    entityName: 'Devendra Singhania (Home Service)',
    targetLink: '/operations?tab=homeservice',
    suggestedActionLabel: 'View Live Specialist GPS Telemetry',
    suggestedActionType: 'VIEW_GPS',
    metadata: {
      financialValue: '₹2,150 Doorstep Bill',
      slaRemaining: 'ETA 18 mins',
    },
    timeline: [
      {
        time: '07:50 AM',
        title: 'Specialist Dispatch Started',
        description: 'UV sterilized kit checked out and vehicle GPS tracking active.',
        actor: 'Logistics Fleet Dispatch',
      },
    ],
  },
  {
    id: 'NOTIF-107',
    title: 'New Franchise Onboarding Application Submitted',
    summary: 'Zenith Esthetics Pvt Ltd submitted formal LOI for Raipur Shankar Nagar outlet.',
    detailedMessage:
      'Zenith Esthetics Pvt Ltd has submitted a new franchise onboarding dossier including commercial floor plan (2,400 sq.ft) in Shankar Nagar, Raipur, KYC documents, and bank guarantees for Brand Owner evaluation.',
    category: 'Franchise & Partner',
    severity: 'Info',
    timestamp: '2026-08-24T16:00:00Z',
    timeAgo: '1 day ago',
    isRead: true,
    isResolved: false,
    branch: 'Raipur Shankar Nagar (Proposed)',
    entityType: 'Franchise Application',
    entityId: 'FP-8802',
    entityName: 'Zenith Esthetics Pvt Ltd',
    targetLink: '/franchise?tab=partners',
    suggestedActionLabel: 'Inspect Site Feasibility & KYC Dossier',
    suggestedActionType: 'INSPECT_PARTNER',
    metadata: {
      financialValue: '₹35L Proposed Setup Capex',
      slaRemaining: 'Evaluation Phase',
    },
    timeline: [
      {
        time: 'Yesterday 04:00 PM',
        title: 'Application Package Uploaded',
        description: 'Architectural drawings and security deposit token verified.',
        actor: 'Franchise Partner Portal',
      },
    ],
  },
  {
    id: 'NOTIF-108',
    title: 'Daily Revenue Target Exceeded (118% Achievement)',
    summary: 'Indrapuri Flagship reached ₹2,48,500 daily turnover against ₹2,10,000 target.',
    detailedMessage:
      'Atelier Indrapuri Flagship has surpassed its daily commercial benchmark with 38 completed services, 4 retail product cross-sells, and 2 annual VIP Platinum memberships sold.',
    category: 'Finance & Royalties',
    severity: 'Success',
    timestamp: '2026-08-24T21:00:00Z',
    timeAgo: '1 day ago',
    isRead: true,
    isResolved: true,
    branch: 'Atelier Indrapuri Flagship',
    entityType: 'Branch Ledger',
    entityId: 'REV-IND-24',
    entityName: 'Indrapuri Daily Close',
    targetLink: '/finance',
    suggestedActionLabel: 'View Commercial Breakdown & EOD Report',
    suggestedActionType: 'VIEW_REPORT',
    metadata: {
      financialValue: '₹2,48,500 Gross GMV',
    },
    timeline: [
      {
        time: 'Yesterday 09:00 PM',
        title: 'EOD Register Reconciled',
        description: 'Card, Cash, and Razorpay settlements balanced with zero variance.',
        actor: 'POS Billing Terminal',
      },
    ],
  },
];
