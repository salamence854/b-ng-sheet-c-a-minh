import { useState, useEffect } from 'react';
import { FinanceData, MonthData, BudgetItem, TransactionCategory } from '../types';
import { getInitialData } from '../utils';

const STORAGE_KEY = 'finance_tracker_data';

export const useFinanceData = () => {
  const [data, setData] = useState<FinanceData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data', e);
        setData(getInitialData());
      }
    } else {
      setData(getInitialData());
    }
  }, []);

  const saveData = (newData: FinanceData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const updateItem = (monthIndex: number, itemId: string, field: 'expected' | 'actual', value: number) => {
    if (!data) return;

    const newData = { ...data };
    const month = { ...newData.months[monthIndex] };
    const items = [...month.items];
    
    const itemIndex = items.findIndex(i => i.id === itemId);
    if (itemIndex >= 0) {
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      month.items = items;
      newData.months[monthIndex] = month;
      saveData(newData);
    }
  };

  const updateItemName = (itemId: string, newName: string) => {
    if (!data) return;
    const baseId = itemId.replace(/_m\d+$/, '');
    const newData = { ...data };
    newData.months = newData.months.map(m => ({
      ...m,
      items: m.items.map(item => 
        item.id.replace(/_m\d+$/, '') === baseId ? { ...item, name: newName } : item
      )
    }));
    saveData(newData);
  };

  const addItem = (group: string, category: TransactionCategory) => {
    if (!data) return;
    const baseId = `custom_${Date.now()}`;
    const newData = { ...data };
    newData.months = newData.months.map(m => ({
      ...m,
      items: [
        ...m.items,
        {
          id: `${baseId}_m${m.month}`,
          name: 'Hạng mục mới',
          expected: 0,
          actual: 0,
          category,
          group
        }
      ]
    }));
    saveData(newData);
  };

  const removeItem = (itemId: string) => {
    if (!data) return;
    const baseId = itemId.replace(/_m\d+$/, '');
    const newData = { ...data };
    newData.months = newData.months.map(m => ({
      ...m,
      items: m.items.filter(item => item.id.replace(/_m\d+$/, '') !== baseId)
    }));
    saveData(newData);
  };

  return { data, updateItem, updateItemName, addItem, removeItem, saveData };
};
