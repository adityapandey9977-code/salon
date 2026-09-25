import { useToast } from '@salon-spa-saas/ui';
import {
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Sparkles,
  Star,
  ThumbsUp,
  Upload,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function FeedbackPage() {
  const { toast } = useToast();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // All 6 Requested Form Fields
  const [selectedAppointment, setSelectedAppointment] = useState('APT-882');
  const [overallRating, setOverallRating] = useState(5);
  const [stylistRating, setStylistRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [comments, setComments] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200',
  ]);

  const appointmentsList = [
    {
      id: 'APT-882',
      label: 'APT-882: Balayage Hair Color & Gloss (July 20, 2026 • Vikram Kulkarni)',
    },
    {
      id: 'APT-855',
      label: 'APT-855: Keratin Hair Spa & Scalp Detox (June 12, 2026 • Aditi Malhotra)',
    },
    {
      id: 'APT-790',
      label: 'APT-790: Hydra Facial Detox & Glow Spa (May 04, 2026 • Priya Sharma)',
    },
  ];

  const [feedbacks, setFeedbacks] = useState([
    {
      id: 'FDB-101',
      appointmentId: 'APT-882',
      date: '2026-07-21',
      serviceName: 'Balayage Hair Color & Gloss',
      stylist: 'Vikram Kulkarni',
      overallRating: 5,
      stylistRating: 5,
      cleanlinessRating: 5,
      comments:
        'Vikram did an amazing job with my balayage! The gloss is super shiny, ammonia-free, and the salon was sparkling clean.',
      photo: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300',
    },
    {
      id: 'FDB-092',
      appointmentId: 'APT-855',
      date: '2026-06-13',
      serviceName: 'Keratin Hair Spa & Scalp Detox',
      stylist: 'Aditi Malhotra',
      overallRating: 5,
      stylistRating: 5,
      cleanlinessRating: 5,
      comments:
        'Aditi gave the best scalp massage. Very relaxing experience and pristine hygiene standards at Indrapuri branch.',
      photo: null,
    },
  ]);

  const handlePhotoUpload = () => {
    toast('Photo Upload: Selected haircut/color result photo attached to review.');
    setUploadedPhotos([
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
      ...uploadedPhotos,
    ]);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();

    const appt = appointmentsList.find((a) => a.id === selectedAppointment);
    const newFdb = {
      id: `FDB-${Math.floor(100 + Math.random() * 90)}`,
      appointmentId: selectedAppointment,
      date: new Date().toISOString().split('T')[0],
      serviceName: appt?.label.split(':')[1]?.split('(')[0]?.trim() || 'Hydra Facial Detox',
      stylist: appt?.label.split('•')[1]?.replace(')', '')?.trim() || 'Priya Sharma',
      overallRating: overallRating,
      stylistRating: stylistRating,
      cleanlinessRating: cleanlinessRating,
      comments: comments || 'Extremely satisfied with the treatment quality and hygiene standards!',
      photo: uploadedPhotos[0] || null,
    };

    setFeedbacks([newFdb, ...feedbacks]);
    setIsFeedbackModalOpen(false);
    setComments('');
    toast(
      `Feedback Submitted: Thank you for your feedback! 50 bonus loyalty points added to your account.`,
    );
  };

  const renderStars = (currentVal: number, setVal?: (n: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setVal && setVal(star)}
          className={`p-0.5 border-0 bg-transparent transition-transform hover:scale-110 ${setVal ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`w-4 h-4 ${
              star <= currentVal ? 'fill-amber-400 text-amber-400' : 'fill-pine/10 text-muted'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Client Feedback &amp; Ratings Desk
          </h1>
          <p className="text-xs text-soft mt-1">
            Share post-appointment ratings for overall experience, specialist service, and salon
            cleanliness to earn 50 bonus points.
          </p>
        </div>

        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Submit Service Review
        </button>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-ink">My Past Visit Reviews</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start border-b border-line pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                      {f.appointmentId}
                    </span>
                    <h4 className="text-sm font-bold text-ink mt-1.5">{f.serviceName}</h4>
                    <p className="text-xs text-soft">
                      Stylist: {f.stylist} • Date: {f.date}
                    </p>
                  </div>
                  {renderStars(f.overallRating)}
                </div>

                {/* Detailed Ratings Breakdown */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-pine/5 rounded-xl text-[11px]">
                  <div>
                    <span className="text-soft block text-[10px]">Overall</span>
                    <span className="font-bold text-amber-600">{f.overallRating} / 5 ★</span>
                  </div>
                  <div>
                    <span className="text-soft block text-[10px]">Stylist</span>
                    <span className="font-bold text-purple-700">{f.stylistRating} / 5 ★</span>
                  </div>
                  <div>
                    <span className="text-soft block text-[10px]">Cleanliness</span>
                    <span className="font-bold text-emerald-700">{f.cleanlinessRating} / 5 ★</span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs text-ink leading-relaxed italic bg-paper/30 p-3 rounded-xl border border-line">
                  &ldquo;{f.comments}&rdquo;
                </p>

                {/* Uploaded Photo Preview */}
                {f.photo && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                      Attached Result Photo:
                    </span>
                    <img
                      src={f.photo}
                      alt="Haircut result"
                      className="w-20 h-20 object-cover rounded-xl border border-line shadow-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Visit Review
                </span>
                <span className="text-purple-700 font-bold">+50 Loyalty Points Earned</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEEDBACK MODAL (createPortal) - ALL 6 SPECIFIED FIELDS */}
      {isFeedbackModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Submit Post-Appointment Review
                  </h3>
                  <p className="text-xs text-soft">
                    Share feedback for your recent visit to help us maintain 5-star service quality
                  </p>
                </div>
                <button
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFeedback} className="space-y-4 text-xs">
                {/* 1. Appointment Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Select Completed Appointment *
                  </label>
                  <select
                    value={selectedAppointment}
                    onChange={(e) => setSelectedAppointment(e.target.value)}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                  >
                    {appointmentsList.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3 Rating Fields: Overall Rating, Stylist Rating, Cleanliness */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-pine/5 rounded-2xl border border-line">
                  {/* 2. Overall Rating */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-soft uppercase tracking-wider">
                      Overall Rating *
                    </label>
                    {renderStars(overallRating, setOverallRating)}
                  </div>

                  {/* 3. Stylist Rating */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-soft uppercase tracking-wider">
                      Stylist Rating *
                    </label>
                    {renderStars(stylistRating, setStylistRating)}
                  </div>

                  {/* 4. Cleanliness */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-soft uppercase tracking-wider">
                      Cleanliness *
                    </label>
                    {renderStars(cleanlinessRating, setCleanlinessRating)}
                  </div>
                </div>

                {/* 5. Comments */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Comments &amp; Styling Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share details about your treatment results, stylist performance, hygiene standards, or advice given..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full p-3 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold text-xs"
                  />
                </div>

                {/* 6. Upload Photos (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Upload Result Photos (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePhotoUpload}
                      className="px-4 py-2 bg-paper/40 hover:bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-dashed border-purple-300 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      Attach Result Photo
                    </button>

                    {uploadedPhotos.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Uploaded result preview"
                        className="w-10 h-10 object-cover rounded-lg border border-purple-300 shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Review Bonus: Earn +50 bonus loyalty points upon review submission!</span>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Submit Review &amp; Claim 50 Pts
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
