import { useToast } from '@salon-spa-saas/ui';
import {
  Calendar,
  Download,
  Eye,
  FileText,
  FolderArchive,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

export function DocumentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // ALL 6 EXACT CATEGORIES & 5 TABLE COLUMNS REQUESTED BY USER
  const [documents] = useState([
    {
      id: 'DOC-101',
      document: 'Master Franchise Agreement (5-Year Term)',
      category: 'Franchise Agreement',
      uploadedDate: '2024-01-15',
      expiry: '2029-01-14',
      status: 'Valid',
    },
    {
      id: 'DOC-102',
      document: 'Municipal Corporation Trade License',
      category: 'Licenses',
      uploadedDate: '2026-01-10',
      expiry: '2026-12-31',
      status: 'Valid',
    },
    {
      id: 'DOC-103',
      document: 'Commercial Public Liability Insurance Policy',
      category: 'Insurance',
      uploadedDate: '2025-12-01',
      expiry: '2026-12-01',
      status: 'Valid',
    },
    {
      id: 'DOC-104',
      document: 'HQ Monthly Hygiene & Mystery Audit Report',
      category: 'Audit Reports',
      uploadedDate: '2026-08-01',
      expiry: '2026-08-31',
      status: 'Valid',
    },
    {
      id: 'DOC-105',
      document: 'GSTIN Registration Tax Certificate',
      category: 'Certificates',
      uploadedDate: '2024-02-01',
      expiry: 'Permanent',
      status: 'Valid',
    },
    {
      id: 'DOC-106',
      document: 'Fire Safety NOC Clearance Certificate',
      category: 'Compliance Documents',
      uploadedDate: '2025-09-15',
      expiry: '2026-09-15',
      status: 'Expiring Soon',
    },
  ]);

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Franchise Document Vault
          </h1>
          <p className="text-xs text-soft mt-1">
            Store and manage important franchise documents across 6 core categories: Franchise
            Agreement, Licenses, Insurance, Audit Reports, Certificates, and Compliance Documents.
          </p>
        </div>

        <button
          onClick={() => toast('Upload Document: Document upload form opened.')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* SEARCH & 6 CATEGORY FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search documents by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600 text-ink font-semibold"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 bg-paper/30 border border-line rounded-xl text-xs font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
            >
              <option value="all">All 6 Document Categories</option>
              <option value="Franchise Agreement">1. Franchise Agreement</option>
              <option value="Licenses">2. Licenses</option>
              <option value="Insurance">3. Insurance</option>
              <option value="Audit Reports">4. Audit Reports</option>
              <option value="Certificates">5. Certificates</option>
              <option value="Compliance Documents">6. Compliance Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 TABLE COLUMNS REQUESTED BY USER: Document, Category, Uploaded Date, Expiry, Status */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Document</th>
                <th className="p-3">Category</th>
                <th className="p-3">Uploaded Date</th>
                <th className="p-3">Expiry</th>
                <th className="p-3 text-right">Status &amp; Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredDocs.map((d) => (
                <tr key={d.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* 1. Document */}
                  <td className="p-3 font-bold text-purple-700">
                    <div>{d.document}</div>
                    <div className="text-[10px] text-soft font-medium">{d.id}</div>
                  </td>

                  {/* 2. Category */}
                  <td className="p-3 font-bold text-ink">{d.category}</td>

                  {/* 3. Uploaded Date */}
                  <td className="p-3 font-medium text-soft">{d.uploadedDate}</td>

                  {/* 4. Expiry */}
                  <td className="p-3 font-bold text-purple-900">{d.expiry}</td>

                  {/* 5. Status & Download Action */}
                  <td className="p-3 text-right space-x-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'Valid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {d.status}
                    </span>

                    <button
                      onClick={() => toast(`Downloading Document: ${d.document} PDF downloaded.`)}
                      className="px-2.5 py-1 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-lg font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3 text-purple-600" /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
