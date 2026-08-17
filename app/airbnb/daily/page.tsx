'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface House {
  id: string;
  name: string;
  city: string;
}

interface DailyEntry {
  house_id: string;
  fees: number;
  revenue: number;
}

export default function DailyTrackerPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEntries(selectedDate);
    }
  }, [selectedDate]);

  async function fetchHouses() {
    const { data, error } = await supabase.from('airbnb_houses').select('*').order('name');
    if (error) console.error(error);
    else if (data) setHouses(data);
  }

  async function fetchEntries(date: string) {
    const { data, error } = await supabase
      .from('airbnb_daily_entries')
      .select('*')
      .eq('entry_date', date);

    if (error) {
      console.error(error);
      return;
    }

    const map: Record<string, DailyEntry> = {};
    data?.forEach((item: any) => {
      map[item.house_id] = {
        house_id: item.house_id,
        fees: item.fees || 0,
        revenue: item.revenue || 0,
      };
    });
    setEntries(map);
  }

  function handleChange(houseId: string, field: 'fees' | 'revenue', value: string) {
    const num = parseFloat(value) || 0;
    setEntries((prev) => ({
      ...prev,
      [houseId]: {
        house_id: houseId,
        fees: prev[houseId]?.fees || 0,
        revenue: prev[houseId]?.revenue || 0,
        [field]: num,
      },
    }));
  }

  async function handleSave() {
    setLoading(true);
    
    const upsertData = Object.values(entries).map((entry) => ({
      house_id: entry.house_id,
      entry_date: selectedDate,
      fees: entry.fees,
      revenue: entry.revenue,
    }));

    if (upsertData.length === 0) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('airbnb_daily_entries')
      .upsert(upsertData, { onConflict: 'house_id,entry_date' });

    setLoading(false);
    if (error) {
      console.error(error);
      alert('Error saving entries.');
    } else {
      setShowModal(true); // Trigger the center popup modal
    }
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-950/75 via-purple-950/65 to-slate-950/85 backdrop-blur-sm pointer-events-none" />

      {/* Center Screen Success Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-pink-100 text-center transform scale-100 transition-all">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Success!</h3>
            <p className="text-slate-600 font-medium text-base mb-6">
              Data saved well, thank you Samiya
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:scale-[1.02] transition active:scale-95"
            >
              OK, Got it
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-pink-100 gap-4">
          <div>
            <Link href="/" className="text-pink-600 font-semibold text-sm hover:underline flex items-center mb-1">
              &larr; Back to Portal
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Daily Tracker</h1>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl border border-pink-200 bg-pink-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Data Entry Card */}
        <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-pink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-pink-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">House Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Fees (MAD)</th>
                  <th className="py-3 px-4">Revenue (MAD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {houses.map((house) => {
                  const entry = entries[house.id] || { fees: 0, revenue: 0 };
                  return (
                    <tr key={house.id} className="hover:bg-pink-50/30 transition">
                      <td className="py-4 px-4 font-bold text-slate-800">{house.name}</td>
                      <td className="py-4 px-4 text-xs font-semibold text-pink-600 uppercase tracking-wider">{house.city}</td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          value={entry.fees === 0 ? '' : entry.fees}
                          onChange={(e) => handleChange(house.id, 'fees', e.target.value)}
                          placeholder="0"
                          className="w-32 px-3 py-2 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <input
                          type="number"
                          value={entry.revenue === 0 ? '' : entry.revenue}
                          onChange={(e) => handleChange(house.id, 'revenue', e.target.value)}
                          placeholder="0"
                          className="w-32 px-3 py-2 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:scale-105 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}