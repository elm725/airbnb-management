'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const EXPENSE_CATEGORIES = ['loyer', 'menage', 'reparation', 'inv', 'personel', 'impot', 'wifi', 'eau', 'elec'];

interface House {
  id: string;
  name: string;
  city: string;
}

export default function DetailedExpensesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07');
  const [expenses, setExpenses] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchExpenses(selectedMonth);
    }
  }, [selectedMonth]);

  async function fetchHouses() {
    const { data } = await supabase.from('airbnb_houses').select('*').order('name');
    if (data) setHouses(data);
  }

  async function fetchExpenses(month: string) {
    const { data } = await supabase
      .from('airbnb_detailed_expenses')
      .select('*')
      .eq('month', month);

    const map: Record<string, Record<string, number>> = {};
    data?.forEach((item: any) => {
      if (!map[item.house_id]) map[item.house_id] = {};
      map[item.house_id][item.category] = item.amount;
    });
    setExpenses(map);
  }

  function handleChange(houseId: string, category: string, value: string) {
    const num = parseFloat(value) || 0;
    setExpenses((prev) => ({
      ...prev,
      [houseId]: {
        ...(prev[houseId] || {}),
        [category]: num,
      },
    }));
  }

  async function handleSaveRow(houseId: string) {
    setLoading(true);
    const houseExpenses = expenses[houseId] || {};
    const upsertData = Object.entries(houseExpenses).map(([category, amount]) => ({
      house_id: houseId,
      month: selectedMonth,
      category,
      amount,
    }));

    if (upsertData.length === 0) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('airbnb_detailed_expenses')
      .upsert(upsertData, { onConflict: 'house_id,month,category' });

    setLoading(false);
    if (error) {
      console.error(error);
      alert('Error saving expenses.');
    } else {
      alert('Saved successfully!');
    }
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6 relative"
      style={{ backgroundImage: `url('/background.png')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-950/75 via-purple-950/65 to-slate-950/85 backdrop-blur-sm pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-pink-100 gap-4">
          <div>
            <Link href="/" className="text-pink-600 font-semibold text-sm hover:underline flex items-center mb-1">
              &larr; Back to Portal
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Monthly Expenses</h1>
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

        {/* Expenses Matrix Card */}
        <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-pink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-pink-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">House</th>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <th key={cat} className="py-3 px-2 capitalize">{cat}</th>
                  ))}
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 text-sm">
                {houses.map((house) => {
                  const houseExp = expenses[house.id] || {};
                  return (
                    <tr key={house.id} className="hover:bg-pink-50/30 transition">
                      <td className="py-4 px-3 font-bold text-slate-800 whitespace-nowrap">{house.name}</td>
                      {EXPENSE_CATEGORIES.map((cat) => {
                        const val = houseExp[cat] || 0;
                        return (
                          <td key={cat} className="py-4 px-2">
                            <input
                              type="number"
                              value={val === 0 ? '' : val}
                              onChange={(e) => handleChange(house.id, cat, e.target.value)}
                              placeholder="0"
                              className="w-20 px-2 py-1.5 rounded-xl border border-pink-200 bg-pink-50/30 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                          </td>
                        );
                      })}
                      <td className="py-4 px-3 text-center">
                        <button
                          onClick={() => handleSaveRow(house.id)}
                          disabled={loading}
                          className="px-4 py-1.5 rounded-xl bg-pink-600 text-white font-semibold text-xs shadow-md shadow-pink-500/20 hover:bg-pink-700 transition"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}