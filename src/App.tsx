import React, { useState } from 'react';
import { Download, LayoutDashboard, CalendarDays } from 'lucide-react';
import { AnnualSummary } from './components/AnnualSummary';
import { MonthlySheet } from './components/MonthlySheet';
import { useFinanceData } from './hooks/useFinanceData';
import { exportToCSV } from './utils';

export default function App() {
  const { data, updateItem, updateItemName, addItem, removeItem } = useFinanceData();
  const [activeTab, setActiveTab] = useState<number>(0); // 0 = Summary, 1-12 = Months

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-slate-500 animate-pulse">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top App Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 inline-flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            Theo Dõi Tài Chính Gia Đình
          </h1>
          <p className="text-xs text-slate-500 mt-1">Năm quản lý: {data.year}</p>
        </div>
        
        <button 
          onClick={() => exportToCSV(data)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          title="Tải file CSV, sau đó bạn có thể upload trực tiếp lên Google Sheets"
        >
          <Download className="w-4 h-4" />
          Tải CSV (Mở bằng Google Sheet)
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Navigation Tabs - Similar to Google Sheets tabs but on top for better Web UX */}
        <div className="flex overflow-x-auto overflow-y-hidden pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          <div className="flex space-x-2 bg-slate-200/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab(0)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 ${
                activeTab === 0 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tổng Quan {data.year}
            </button>
            
            {data.months.map(m => (
              <button
                key={m.month}
                onClick={() => setActiveTab(m.month)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
                  activeTab === m.month 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <CalendarDays className="w-4 h-4 opacity-50" />
                Tháng {m.month}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 0 ? (
            <AnnualSummary data={data} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 xl:p-8">
              <div className="mb-8 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Cân đối thu chi Tháng {activeTab} / {data.year}</h2>
                <p className="text-slate-500 mt-1">Quản lý dự kiến và thực tế trong tháng.</p>
              </div>
              <MonthlySheet 
                monthData={data.months[activeTab - 1]} 
                monthIndex={activeTab - 1}
                onUpdate={updateItem}
                onUpdateName={updateItemName}
                onAddItem={addItem}
                onRemoveItem={removeItem}
              />
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
