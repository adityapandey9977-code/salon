import type React from 'react';
import { createContext, useContext, useState } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  benefits: string[];
  requiresPatchTest?: boolean;
}

export interface SalonBranch {
  id: string;
  name: string;
  distance: string;
  address?: string;
}

export interface Specialist {
  id: string;
  name: string;
  rating: number;
  experience: string;
  avatar: string;
  lastFormulaNote?: string;
}

export interface Appointment {
  id: string;
  bookingId: string;
  serviceName: string;
  duration: number;
  price: number;
  branchName: string;
  specialistName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  image: string;
  otpCode?: string;
  isHomeService?: boolean;
  travelFee?: number;
  beforeAfterPhotos?: { before: string; after: string };
  consultationData?: {
    allergies: string[];
    skinType: string;
    consentAgreed: boolean;
  };
}

export interface PackageItem {
  id: string;
  name: string;
  usedSessions: number;
  totalSessions: number;
  validity: string;
}

export interface Transaction {
  id: string;
  title: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  tag: string;
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  title: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface HouseholdMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  allergies?: string;
}

interface AppContextType {
  user: {
    name: string;
    email?: string;
    phone?: string;
    tier: string;
    points: number;
    walletBalance: number;
    avatar: string;
    allergies: string[];
    communicationConsent: { whatsapp: boolean; sms: boolean; email: boolean };
    savedAddress: string;
  };
  householdMembers: HouseholdMember[];
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  selectedBranch: SalonBranch;
  setSelectedBranch: (branch: SalonBranch) => void;
  branches: SalonBranch[];
  services: ServiceItem[];
  specialists: Specialist[];
  appointments: Appointment[];
  packages: PackageItem[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  bookingFlow: {
    selectedService: ServiceItem | null;
    selectedCategory: string;
    selectedBranch: SalonBranch | null;
    selectedSpecialist: Specialist | null;
    selectedDate: string;
    selectedTime: string;
    paymentOption: string;
    isHomeService: boolean;
    travelFee: number;
    appliedCoupon: string | null;
    couponDiscount: number;
    redeemedPackageId: string | null;
    consultation: {
      allergies: string[];
      skinType: string;
      consentAgreed: boolean;
      selectedMemberId: string;
    };
  };
  updateBookingFlow: (data: Partial<AppContextType['bookingFlow']>) => void;
  resetBookingFlow: () => void;
  addAppointment: (newApp: Appointment) => void;
  cancelAppointment: (id: string) => void;
  addMoneyToWallet: (amount: number) => void;
  redeemPoints: (points: number) => void;
  redeemPackageSession: (packageId: string) => void;
  createSupportTicket: (title: string) => void;
  applyCouponCode: (code: string) => boolean;
  toggleConsent: (type: 'whatsapp' | 'sms' | 'email') => void;
  updateUserAllergies: (allergies: string[]) => void;
  updateUserProfile: (data: Partial<AppContextType['user']>) => void;
}

const defaultServices: ServiceItem[] = [
  {
    id: 's1',
    name: 'Hydra Facial Detox & Glow Spa',
    category: 'Facial',
    duration: 60,
    price: 4200,
    rating: 4.8,
    reviewsCount: 230,
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    description:
      'Deep pore cleansing, hyaluronic acid infusion, vacuum extraction, and LED light therapy for instant glow.',
    benefits: [
      'Deep cleansing & detox',
      'Hydration boost',
      'Instant radiant glow',
      'Improves skin texture',
    ],
    requiresPatchTest: false,
  },
  {
    id: 's2',
    name: 'Balayage Hair Color',
    category: 'Hair Color',
    duration: 120,
    price: 6500,
    rating: 4.9,
    reviewsCount: 185,
    image:
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    description:
      'Hand-painted dimensional highlighting technique tailored to your natural hair shade and skin tone.',
    benefits: [
      'Sun-kissed effect',
      'Seamless regrowth',
      'Ammonia-free formulas',
      'Long-lasting shine',
    ],
    requiresPatchTest: true,
  },
  {
    id: 's3',
    name: 'Deep Tissue Massage',
    category: 'Massage',
    duration: 90,
    price: 4500,
    rating: 4.7,
    reviewsCount: 142,
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    description:
      'Targeted muscle therapy utilizing slow stroke pressure to relieve tension and chronic stiffness.',
    benefits: [
      'Muscle knot relief',
      'Stress reduction',
      'Improved circulation',
      'Post-workout recovery',
    ],
    requiresPatchTest: false,
  },
  {
    id: 's4',
    name: 'Haircut & Blowdry',
    category: 'Hair',
    duration: 45,
    price: 750,
    rating: 4.6,
    reviewsCount: 310,
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    description: 'Precision hair trim and styled blowdry tailored by senior hair specialists.',
    benefits: [
      'Split end removal',
      'Custom head shape styling',
      'Heat protection spray',
      'Volumizing finish',
    ],
    requiresPatchTest: false,
  },
];

const defaultBranches: SalonBranch[] = [
  {
    id: 'b1',
    name: 'Indrapuri Central Outlet',
    distance: '2.5 km away',
    address: 'Plot 14, B-Sector, Indrapuri',
  },
  {
    id: 'b2',
    name: 'Arera Colony Outlet',
    distance: '4.2 km away',
    address: 'E-5/12, Arera Colony Main Rd',
  },
  {
    id: 'b3',
    name: 'Vijay Nagar Outlet',
    distance: '5.1 km away',
    address: '102 Scheme 54, Vijay Nagar',
  },
  { id: 'b4', name: 'A.B. Road Outlet', distance: '6.3 km away', address: 'Tower B, AB Road Mall' },
];

const defaultSpecialists: Specialist[] = [
  {
    id: 'sp1',
    name: 'Priya Sharma',
    rating: 4.9,
    experience: '8 yrs exp',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    lastFormulaNote: 'Shade 7.1 Ash Blonde + 20 Vol Dev (July 2026)',
  },
  {
    id: 'sp2',
    name: 'Neha Singh',
    rating: 4.7,
    experience: '6 yrs exp',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    lastFormulaNote: 'Hydra Serum Level 2 Sensitive Formula',
  },
  {
    id: 'sp3',
    name: 'Kavita Jain',
    rating: 4.8,
    experience: '7 yrs exp',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    lastFormulaNote: 'Aromatherapy Lavender Essential Blend',
  },
  {
    id: 'sp4',
    name: 'Anjali Verma',
    rating: 4.6,
    experience: '5 yrs exp',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    lastFormulaNote: 'Precision Layered Trim 2-inch cutoff',
  },
];

const defaultAppointments: Appointment[] = [
  {
    id: 'app1',
    bookingId: 'APT-10024',
    serviceName: 'Hydra Facial Detox & Glow Spa',
    duration: 60,
    price: 4200,
    branchName: 'Indrapuri Central Outlet',
    specialistName: 'Priya Sharma',
    date: '12 Aug 2026 · 11:30 AM',
    time: '11:30 AM',
    status: 'Confirmed',
    otpCode: '4892',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    beforeAfterPhotos: {
      before:
        'https://images.unsplash.com/photo-1512290900676-26c2a48f572d?auto=format&fit=crop&w=300&q=80',
      after:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    id: 'app2',
    bookingId: 'APT-10018',
    serviceName: 'Balayage Hair Color',
    duration: 120,
    price: 6500,
    branchName: 'Arera Colony Outlet',
    specialistName: 'Neha Singh',
    date: '28 Aug 2026 · 04:00 PM',
    time: '04:00 PM',
    status: 'Confirmed',
    otpCode: '7105',
    image:
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'app3',
    bookingId: 'APT-09941',
    serviceName: 'Deep Tissue Massage',
    duration: 90,
    price: 4500,
    branchName: 'Indrapuri Central Outlet',
    specialistName: 'Kavita Jain',
    date: '05 Sep 2026 · 12:00 PM',
    time: '12:00 PM',
    status: 'Confirmed',
    otpCode: '3920',
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
  },
];

const defaultPackages: PackageItem[] = [
  {
    id: 'pkg1',
    name: 'Bridal Pamper Glow Package',
    usedSessions: 3,
    totalSessions: 5,
    validity: 'Valid till 11 Nov 2026',
  },
  {
    id: 'pkg2',
    name: 'Annual Keratin Hair Care Pass',
    usedSessions: 2,
    totalSessions: 5,
    validity: 'Valid till 15 Feb 2027',
  },
];

const defaultTransactions: Transaction[] = [
  {
    id: 't1',
    title: 'Cashback Bonus',
    type: 'credit',
    amount: 500,
    date: '05 Aug 2026',
    tag: 'Reward',
  },
  {
    id: 't2',
    title: 'Service Payment',
    type: 'debit',
    amount: 900,
    date: '05 Aug 2026',
    tag: 'Booking',
  },
  {
    id: 't3',
    title: 'Wallet Recharge',
    type: 'credit',
    amount: 2000,
    date: '01 Aug 2026',
    tag: 'Topup',
  },
  {
    id: 't4',
    title: 'Deposit Refund',
    type: 'debit',
    amount: 300,
    date: '29 Jul 2026',
    tag: 'Refund',
  },
];

const defaultTickets: SupportTicket[] = [
  {
    id: 'tk1',
    ticketNo: '#TKT-3901',
    title: 'Payment Issue',
    date: '05 Aug 2026',
    status: 'Open',
  },
  {
    id: 'tk2',
    ticketNo: '#TKT-2810',
    title: 'Appointment Not Showing',
    date: '02 Aug 2026',
    status: 'In Progress',
  },
  {
    id: 'tk3',
    ticketNo: '#TKT-2705',
    title: 'Package Redemption',
    date: '25 Jul 2026',
    status: 'Resolved',
  },
];

const defaultHousehold: HouseholdMember[] = [
  {
    id: 'hm1',
    name: 'Aditya Pandey (Self)',
    relation: 'Self',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    allergies: 'Ammonia sensitive',
  },
  {
    id: 'hm2',
    name: 'Ananya Sharma',
    relation: 'Daughter',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    allergies: 'None',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Aditya Pandey',
    email: 'aditya.pandey@digiflex.com',
    phone: '+91 98765 43210',
    tier: 'Gold Member',
    points: 11250,
    walletBalance: 2450,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    allergies: ['Ammonia sensitive', 'Latex caution'],
    communicationConsent: { whatsapp: true, sms: true, email: false },
    savedAddress: 'Flat 402, Royal Palms, Arera Colony, Bhopal',
  });

  const [toast, setToast] = useState<ToastState | null>(null);
  const [householdMembers] = useState<HouseholdMember[]>(defaultHousehold);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const updateUserProfile = (data: Partial<typeof user>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Profile & Personal Information updated!', 'success');
  };

  const [selectedBranch, setSelectedBranch] = useState<SalonBranch>(defaultBranches[0]);
  const [branches] = useState<SalonBranch[]>(defaultBranches);
  const [services] = useState<ServiceItem[]>(defaultServices);
  const [specialists] = useState<Specialist[]>(defaultSpecialists);
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments);
  const [packages, setPackages] = useState<PackageItem[]>(defaultPackages);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [tickets, setTickets] = useState<SupportTicket[]>(defaultTickets);

  const [bookingFlow, setBookingFlow] = useState<AppContextType['bookingFlow']>({
    selectedService: defaultServices[0],
    selectedCategory: 'Facial',
    selectedBranch: defaultBranches[0],
    selectedSpecialist: defaultSpecialists[0],
    selectedDate: '12 Aug 2026 (Tue)',
    selectedTime: '11:30 AM',
    paymentOption: 'Card / GPay',
    isHomeService: false,
    travelFee: 150,
    appliedCoupon: null,
    couponDiscount: 0,
    redeemedPackageId: null,
    consultation: {
      allergies: ['Ammonia sensitive'],
      skinType: 'Normal / Combination',
      consentAgreed: true,
      selectedMemberId: 'hm1',
    },
  });

  const updateBookingFlow = (data: Partial<AppContextType['bookingFlow']>) => {
    setBookingFlow((prev) => ({ ...prev, ...data }));
  };

  const resetBookingFlow = () => {
    setBookingFlow({
      selectedService: defaultServices[0],
      selectedCategory: 'Facial',
      selectedBranch: defaultBranches[0],
      selectedSpecialist: defaultSpecialists[0],
      selectedDate: '12 Aug 2026 (Tue)',
      selectedTime: '11:30 AM',
      paymentOption: 'Card / GPay',
      isHomeService: false,
      travelFee: 150,
      appliedCoupon: null,
      couponDiscount: 0,
      redeemedPackageId: null,
      consultation: {
        allergies: ['Ammonia sensitive'],
        skinType: 'Normal / Combination',
        consentAgreed: true,
        selectedMemberId: 'hm1',
      },
    });
  };

  const addAppointment = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);
    showToast(`Appointment ${newApp.bookingId} confirmed!`, 'success');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'Cancelled' as const } : app)),
    );
    showToast('Appointment cancelled successfully', 'info');
  };

  const addMoneyToWallet = (amount: number) => {
    setUser((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setTransactions((prev) => [
      {
        id: `t_${Date.now()}`,
        title: 'Wallet Top-up',
        type: 'credit',
        amount,
        date: 'Today',
        tag: 'Topup',
      },
      ...prev,
    ]);
    showToast(`₹${amount} added to   Wallet!`, 'success');
  };

  const redeemPoints = (points: number) => {
    if (user.points >= points) {
      const discountVal = Math.floor(points / 10);
      setUser((prev) => ({ ...prev, points: prev.points - points }));
      showToast(`Redeemed ${points} points for ₹${discountVal} voucher!`, 'success');
    } else {
      showToast('Insufficient loyalty points balance', 'error');
    }
  };

  const redeemPackageSession = (packageId: string) => {
    setPackages((prev) =>
      prev.map((pkg) =>
        pkg.id === packageId && pkg.usedSessions < pkg.totalSessions
          ? { ...pkg, usedSessions: pkg.usedSessions + 1 }
          : pkg,
      ),
    );
    showToast('Redeemed 1 package session!', 'success');
  };

  const applyCouponCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GOLD15' || cleanCode === 'WELCOME15') {
      updateBookingFlow({ appliedCoupon: cleanCode, couponDiscount: 630 });
      showToast('Coupon code applied! Saved ₹630', 'success');
      return true;
    }
    showToast('Invalid promo coupon code', 'error');
    return false;
  };

  const toggleConsent = (type: 'whatsapp' | 'sms' | 'email') => {
    setUser((prev) => {
      const updated = {
        ...prev.communicationConsent,
        [type]: !prev.communicationConsent[type],
      };
      showToast(`Updated ${type.toUpperCase()} communication consent`, 'info');
      return { ...prev, communicationConsent: updated };
    });
  };

  const updateUserAllergies = (allergies: string[]) => {
    setUser((prev) => ({ ...prev, allergies }));
    showToast('Health & allergy profile updated', 'success');
  };

  const createSupportTicket = (title: string) => {
    const newTk: SupportTicket = {
      id: `tk_${Date.now()}`,
      ticketNo: `#TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      date: 'Today',
      status: 'Open',
    };
    setTickets((prev) => [newTk, ...prev]);
    showToast('Support ticket created successfully!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        householdMembers,
        toast,
        showToast,
        selectedBranch,
        setSelectedBranch,
        branches,
        services,
        specialists,
        appointments,
        packages,
        transactions,
        tickets,
        bookingFlow,
        updateBookingFlow,
        resetBookingFlow,
        addAppointment,
        cancelAppointment,
        addMoneyToWallet,
        redeemPoints,
        redeemPackageSession,
        createSupportTicket,
        applyCouponCode,
        toggleConsent,
        updateUserAllergies,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
