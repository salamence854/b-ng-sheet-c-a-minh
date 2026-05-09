import React, { useState } from 'react';
import { MonthData, BudgetItem, TransactionCategory } from '../types';
import { formatCurrency, parseCurrencyString } from '../utils';
import { Plus, Trash2 } from 'lucide-react';

interface MonthlySheetProps {
  monthData: MonthData;
  monthIndex: number;
  onUpdate: (monthIndex: number, itemId: string, field: 'expected' | 'actual', value: number) => void;
  onUpdateName: (itemId: string, newName: string) => void;
  onAddItem: (group: string, category: TransactionCategory) => void;
  onRemoveItem: (itemId: string) => void;
}

export const MonthlySheet: React.FC<MonthlySheetProps> = ({ 
  monthData, 
  monthIndex, 
  onUpdate,
  onUpdateName,
  onAddItem,
  onRemoveItem
}) => {
  const handleCellChange = (itemId: string, field: 'expected' | 'actual', strValue: string) => {
    const val = parseCurrencyString(strValue);
    onUpdate(monthIndex, itemId, field, isNaN(val) ? 0 : val);
  };

  const getGroupedItems = (category: TransactionCategory) => {
    const items = monthData.items.filter(i => i.category === category);
    const groups: Record<string, BudgetItem[]> = {};
    items.forEach(item => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    });
    return groups;
  };

  const incomeGroups = getGroupedItems('INCOME');
  const expenseGroups = getGroupedItems('EXPENSE');
  const savingGroups = getGroupedItems('SAVING');

  const calcTotal = (items: BudgetItem[], field: 'expected' | 'actual') => {
    return items.reduce((sum, item) => sum + item[field], 0);
  };

  const totalIncomeExpected = calcTotal(monthData.items.filter(i => i.category === 'INCOME'), 'expected');
  const totalIncomeActual = calcTotal(monthData.items.filter(i => i.category === 'INCOME'), 'actual');
  
  const totalExpenseExpected = calcTotal(monthData.items.filter(i => i.category === 'EXPENSE'), 'expected');
  const totalExpenseActual = calcTotal(monthData.items.filter(i => i.category === 'EXPENSE'), 'actual');

  const totalSavingExpected = calcTotal(monthData.items.filter(i => i.category === 'SAVING'), 'expected');
  const totalSavingActual = calcTotal(monthData.items.filter(i => i.category === 'SAVING'), 'actual');

  const TableSection = ({ title, groups, type }: { title: string, groups: Record<string, BudgetItem[]>, type: TransactionCategory }) => (
    <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 w-1/2">Hạng mục</th>
            <th className="px-4 py-3 w-1/4 text-right">Dự kiến</th>
            <th className="px-4 py-3 w-1/4 text-right">Thực tế</th>
            <th className="px-2 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([groupName, items]) => (
            <React.Fragment key={groupName}>
              <tr className="bg-slate-100 border-b border-slate-200">
                <td colSpan={4} className="px-4 py-2 font-medium text-slate-700">{groupName}</td>
              </tr>
              {items.map(item => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="p-1">
                    <input
                      type="text"
                      className="w-full text-left px-3 py-2 rounded focus:ring-1 focus:ring-blue-400 focus:outline-none bg-transparent hover:bg-white text-slate-700 font-medium"
                      value={item.name}
                      onChange={(e) => onUpdateName(item.id, e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      className="w-full text-right p-2 rounded border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-transparent hover:bg-white"
                      value={formatCurrency(item.expected)}
                      onChange={(e) => handleCellChange(item.id, 'expected', e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      className="w-full text-right p-2 rounded border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none bg-transparent hover:bg-white font-medium"
                      value={formatCurrency(item.actual)}
                      onChange={(e) => handleCellChange(item.id, 'actual', e.target.value)}
                      onFocus={(e) => e.target.select()}
                    />
                  </td>
                  <td className="p-1 text-center">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-rose-50"
                      title="Xóa hạng mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-b border-slate-100 bg-white">
                <td colSpan={4} className="p-1">
                  <button
                    onClick={() => onAddItem(groupName, type)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded text-sm font-medium transition-colors w-full"
                  >
                    <Plus className="w-4 h-4" /> Thêm hạng mục
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm border-t-4 border-t-emerald-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Thu Nhập (Thực tế)</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalIncomeActual)}</p>
          <p className="text-sm text-slate-400 mt-2">Dự kiến: {formatCurrency(totalIncomeExpected)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-rose-100 shadow-sm border-t-4 border-t-rose-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Chi Phí (Thực tế)</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpenseActual)}</p>
          <p className="text-sm text-slate-400 mt-2">Dự kiến: {formatCurrency(totalExpenseExpected)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm border-t-4 border-t-blue-500">
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Tiết Kiệm (Thực tế)</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSavingActual)}</p>
          <p className="text-sm text-slate-400 mt-2">Dự kiến: {formatCurrency(totalSavingExpected)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TableSection title="Thu Nhập" groups={incomeGroups} type="INCOME" />
          <TableSection title="Tiết Kiệm & Đầu Tư" groups={savingGroups} type="SAVING" />
        </div>
        <div>
          <TableSection title="Chi Phí" groups={expenseGroups} type="EXPENSE" />
        </div>
      </div>
    </div>
  );
};
