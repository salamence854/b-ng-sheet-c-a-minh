import React from 'react';
import { FinanceData } from '../types';
import { formatCurrency } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnnualSummaryProps {
  data: FinanceData;
}

export const AnnualSummary: React.FC<AnnualSummaryProps> = ({ data }) => {
  const processData = () => {
    return data.months.map(m => {
      let income = 0;
      let expense = 0;
      let saving = 0;
      
      m.items.forEach(item => {
        if (item.category === 'INCOME') income += item.actual;
        if (item.category === 'EXPENSE') expense += item.actual;
        if (item.category === 'SAVING') saving += item.actual;
      });

      return {
        name: `T${m.month}`,
        income,
        expense,
        saving,
        net: income - expense,
      };
    });
  };

  const chartData = processData();
  const totalIncome = chartData.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = chartData.reduce((sum, m) => sum + m.expense, 0);
  const totalSaving = chartData.reduce((sum, m) => sum + m.saving, 0);
  const totalNet = totalIncome - totalExpense;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-md rounded-lg">
          <p className="font-semibold text-slate-800 mb-2">{`Tháng ${label.replace('T', '')}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm border-b border-slate-50 py-1 last:border-0">
              {entry.name === 'income' && 'Thu nhập: '}
              {entry.name === 'expense' && 'Chi phí: '}
              {entry.name === 'net' && 'Còn lại (Net): '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Thu Nhập Năm</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Chi Chi Tiêu</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Đã Tiết Kiệm</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalSaving)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <p className="text-sm font-medium text-slate-500 mb-1">Dư Nợ (Net)</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalNet)}</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Biểu đồ Thu / Chi theo tháng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b'}}
                  tickFormatter={(value) => `${value / 1000000}tr`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Chi phí" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Xu hướng Tích lũy (Net Income)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b'}}
                  tickFormatter={(value) => `${value / 1000000}tr`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="net" name="Thặng dư (Thu - Chi)" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Annual Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Bảng Tổng Hợp Chi Tiết Thực Tế</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-max">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_#e2e8f0]">Hạng mục</th>
                {data.months.map(m => (
                  <th key={m.month} className="px-4 py-3 font-medium text-right">T{m.month}</th>
                ))}
                <th className="px-6 py-3 font-bold text-slate-800 text-right bg-slate-100">Tổng Năm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Combine unique names logic to build summary rows */}
              {(() => {
                const uniqueNames = Array.from(new Set(data.months[0].items.map(i => i.name)));
                return uniqueNames.map(name => {
                  let yearTotal = 0;
                  return (
                    <tr key={name} className="hover:bg-slate-50">
                      <td className="px-6 py-3 sticky left-0 bg-white shadow-[1px_0_0_#f1f5f9] group-hover:bg-slate-50 text-slate-700 font-medium">
                        {name}
                      </td>
                      {data.months.map(m => {
                        const item = m.items.find(i => i.name === name);
                        const val = item ? item.actual : 0;
                        yearTotal += val;
                        return (
                          <td key={m.month} className="px-4 py-3 text-right text-slate-600">
                            {val > 0 ? formatCurrency(val) : '-'}
                          </td>
                        );
                      })}
                      <td className="px-6 py-3 text-right font-semibold text-slate-800 bg-slate-50">
                        {formatCurrency(yearTotal)}
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
