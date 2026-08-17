'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface HouseSummary {
  id: string;
  name: string;
  city: string;
  totalRevenue: number;
  totalFees: number;
  totalExpenses: number;
  netProfit: number;
  daysBooked: number;
  occupancyRate: number;
}

export default function SummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07');
  const [citySummaries, setCitySummaries] = useState<Record<string, HouseSummary[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMonth) {
      calculateSummary(selectedMonth);
    }
  }, [selectedMonth]);

  async function calculateSummary(monthStr: string) {
    setLoading(true);
    const [year, month] = monthStr.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${monthStr}-01`;
    const endDate = `${monthStr}-${daysInMonth}`;

    // Fetch houses
    const { data: houses } = await supabase.from('airbnb_houses').select('*').order('name');
    // Fetch daily entries
    const { data: daily } = await supabase
      .from('airbnb_daily_entries')
      .select('*')
      .gte('entry_date', startDate)
      .lte('entry_date', endDate);

    // Fetch detailed expenses
    const { data: expenses } = await supabase
      .from('airbnb_detailed_expenses')
      .select('*')
      .eq('month', monthStr);

    if (!houses) {
      setLoading(false);
      return;
    }

    const summaries: HouseSummary[] = houses.map((house) => {
      // Daily calculations
      const houseDaily = daily?.filter((d) => d.house_id === house.id) || [];
      const totalRevenue = houseDaily.reduce((sum, d) => sum + (d.revenue || 0), 0);
      const totalFees = houseDaily.reduce((sum, d) => sum + (d.fees || 0), 0);
      const daysBooked = houseDaily.filter((d) => (d.revenue || 0) > 0).length;
      const occupancyRate = Math.round((daysBooked / daysInMonth) * 100);

      // Detailed expenses calculations
      const houseExpenses = expenses?.filter((e) => e.house_id === house.id) || [];
      const totalExpenses = houseExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      const netProfit = totalRevenue - (totalFees + totalExpenses);

      return {
        id: house.id,
        name: house.name,
        city: house.city,
        totalRevenue,
        totalFees,
        totalExpenses,
        netProfit,
        daysBooked,
        occupancyRate,
      };
    });

    // Group by city
    const grouped: Record<string, HouseSummary[]> = {};
    summaries.forEach((s) => {
      if (!grouped[s.city]) grouped[s.city] = [];
      grouped[s.city].push(s);
    });

    setCitySummaries(grouped);
    setLoading(false);
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-950/75 via-purple-950/65 to-slate-950/85 backdrop-blur-sm pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-pink-100 gap-4">
          <div>
            <Link href="/" className="text-pink-600 font-semibold text-sm hover:underline flex items-center mb-1">
              &larr; Back to Portal
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Monthly Performance & Statistics</h1>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-xl border border-pink-200 bg-pink-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white font-semibold text-lg">Calculating statistics...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(citySummaries).map(([city, houses]) => {
              const cityRev = houses.reduce((sum, h) => sum + h.totalRevenue, 0);
              const cityNet = houses.reduce((sum, h) => sum + h.netProfit, 0);

              return (
                <div key={city} className="bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-pink-100">
                  <div className="flex flex-col sm:flex-row justify-between items-baseline border-b border-pink-100 pb-4 mb-6 gap-2">
                    <h2 className="text-2xl font-black text-slate-900">{city}</h2>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      City Revenue: <span className="text-pink-600 font-extrabold">{cityRev.toLocaleString()} MAD</span> | 
                      City Net Profit: <span className="text-emerald-600 font-extrabold">{cityNet.toLocaleString()} MAD</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {houses.map((house) => (
                      <div key={house.id} className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 mb-3">{house.name}</h3>
                          <div className="space-y-1.5 text-xs text-slate-600">
                            <div className="flex justify-between">
                              <span>Total Revenue:</span>
                              <span className="font-bold text-slate-900">{house.totalRevenue.toLocaleString()} MAD</span>
                            </div>
                            <div className="flex justify-between">
                              <span>All Fees & Expenses:</span>
                              <span className="font-bold text-rose-600">-{(house.totalFees + house.totalExpenses).toLocaleString()} MAD</span>
                            </div>
                            <div className="flex justify-between border-t border-pink-200/60 pt-1.5">
                              <span className="font-bold text-slate-800">Net Profit:</span>
                              <span className="font-extrabold text-emerald-600">{house.netProfit.toLocaleString()} MAD</span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span>Occupancy:</span>
                              <span className="font-bold text-pink-600">{house.occupancyRate}% ({house.daysBooked} days)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}