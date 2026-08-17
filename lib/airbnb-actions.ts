import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function getHouses() {
  const { data, error } = await supabase.from('airbnb_houses').select('*').order('city');
  if (error) throw error;
  return data;
}

export async function getDailyEntries(dateStr: string) {
  const { data, error } = await supabase
    .from('airbnb_daily_entries')
    .select('*')
    .eq('entry_date', dateStr);
  if (error) throw error;
  return data;
}

export async function upsertDailyEntry(houseId: string, dateStr: string, fees: number, revenue: number) {
  const { error } = await supabase
    .from('airbnb_daily_entries')
    .upsert({ house_id: houseId, entry_date: dateStr, fees, revenue }, { onConflict: 'house_id,entry_date' });
  if (error) throw error;
}

export async function getMonthlyExpenses(monthStr: string) {
  const { data, error } = await supabase
    .from('airbnb_monthly_expenses')
    .select('*, airbnb_houses(name, city)')
    .eq('month', monthStr);
  if (error) throw error;
  return data;
}

export async function addMonthlyExpense(houseId: string, month: string, expenseName: string, amount: number) {
  const { error } = await supabase
    .from('airbnb_monthly_expenses')
    .insert({ house_id: houseId, month, expense_name: expenseName, amount });
  if (error) throw error;
}

export async function getDetailedExpenses(monthStr: string) {
  const { data, error } = await supabase
    .from('airbnb_detailed_expenses')
    .select('*, airbnb_houses(name, city)')
    .eq('month', monthStr);
  if (error) throw error;
  return data;
}

export async function upsertDetailedExpense(houseId: string, month: string, category: string, amount: number) {
  const { error } = await supabase
    .from('airbnb_detailed_expenses')
    .upsert(
      { house_id: houseId, month, category, amount },
      { onConflict: 'house_id,month,category' }
    );
  if (error) throw error;
}

export async function getPartnerSplits(monthStr: string) {
  const { data, error } = await supabase
    .from('airbnb_partner_splits')
    .select('*')
    .eq('month', monthStr);
  if (error) throw error;
  return data;
}

export async function getMonthlySummary(monthPrefix: string) {
  const { data: houses } = await supabase.from('airbnb_houses').select('*');
  const { data: entries } = await supabase
    .from('airbnb_daily_entries')
    .select('*')
    .gte('entry_date', `${monthPrefix}-01`)
    .lte('entry_date', `${monthPrefix}-31`);

  const { data: expenses } = await supabase
    .from('airbnb_monthly_expenses')
    .select('*')
    .eq('month', monthPrefix);

  const { data: detailedExpenses } = await supabase
    .from('airbnb_detailed_expenses')
    .select('*')
    .eq('month', monthPrefix);

  return { 
    houses: houses || [], 
    entries: entries || [], 
    expenses: expenses || [], 
    detailedExpenses: detailedExpenses || [] 
  };
}