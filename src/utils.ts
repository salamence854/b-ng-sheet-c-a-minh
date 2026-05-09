import { BudgetItem, FinanceData, MonthData, TransactionCategory } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrencyString = (value: string): number => {
  const cleanString = value.replace(/[^0-9-]/g, '');
  return parseInt(cleanString || '0', 10);
};

const generateDefaultItems = (): BudgetItem[] => [
  // Income
  { id: 'inc_1', name: 'Lương vợ', group: 'Thu nhập vợ', category: 'INCOME', expected: 15000000, actual: 0 },
  { id: 'inc_2', name: 'Thưởng/Khác (Vợ)', group: 'Thu nhập vợ', category: 'INCOME', expected: 0, actual: 0 },
  { id: 'inc_3', name: 'Lương chồng', group: 'Thu nhập chồng', category: 'INCOME', expected: 20000000, actual: 0 },
  { id: 'inc_4', name: 'Thưởng/Khác (Chồng)', group: 'Thu nhập chồng', category: 'INCOME', expected: 0, actual: 0 },
  { id: 'inc_5', name: 'Nguồn thu khác', group: 'Khác', category: 'INCOME', expected: 0, actual: 0 },

  // Expenses
  { id: 'exp_1', name: 'Thuê nhà / Trả góp', group: 'Chi phí cố định', category: 'EXPENSE', expected: 6000000, actual: 0 },
  { id: 'exp_2', name: 'Điện, Nước, Internet', group: 'Chi phí cố định', category: 'EXPENSE', expected: 15000000, actual: 0 },
  { id: 'exp_3', name: 'Phí dịch vụ chung cư', group: 'Chi phí cố định', category: 'EXPENSE', expected: 500000, actual: 0 },
  
  { id: 'exp_4', name: 'Đi chợ / Siêu thị', group: 'Sinh hoạt & Ăn uống', category: 'EXPENSE', expected: 6000000, actual: 0 },
  { id: 'exp_5', name: 'Ăn ngoài / Cafe', group: 'Sinh hoạt & Ăn uống', category: 'EXPENSE', expected: 2000000, actual: 0 },
  { id: 'exp_6', name: 'Xăng xe / Đi lại', group: 'Sinh hoạt & Ăn uống', category: 'EXPENSE', expected: 1000000, actual: 0 },

  { id: 'exp_7', name: 'Mua sắm áo quần', group: 'Cá nhân', category: 'EXPENSE', expected: 1500000, actual: 0 },
  { id: 'exp_8', name: 'Mỹ phẩm / Cắt tóc', group: 'Cá nhân', category: 'EXPENSE', expected: 500000, actual: 0 },
  { id: 'exp_9', name: 'Tiêu vặt chồng', group: 'Cá nhân', category: 'EXPENSE', expected: 2000000, actual: 0 },
  { id: 'exp_10', name: 'Tiêu vặt vợ', group: 'Cá nhân', category: 'EXPENSE', expected: 2000000, actual: 0 },

  { id: 'exp_11', name: 'Hiếu, Hỉ, Giao tế', group: 'Phát sinh', category: 'EXPENSE', expected: 1000000, actual: 0 },
  { id: 'exp_12', name: 'Sức khoẻ / Bảo hiểm', group: 'Phát sinh', category: 'EXPENSE', expected: 1000000, actual: 0 },

  // Savings
  { id: 'sav_1', name: 'Quỹ khẩn cấp', group: 'Tiết kiệm / Đầu tư', category: 'SAVING', expected: 2000000, actual: 0 },
  { id: 'sav_2', name: 'Tiết kiệm dài hạn', group: 'Tiết kiệm / Đầu tư', category: 'SAVING', expected: 5000000, actual: 0 },
  { id: 'sav_3', name: 'Đầu tư (Cổ phiếu, Crypto)', group: 'Tiết kiệm / Đầu tư', category: 'SAVING', expected: 2000000, actual: 0 },
];

export const getInitialData = (): FinanceData => {
  const year = new Date().getFullYear();
  const months: MonthData[] = [];
  
  for (let m = 1; m <= 12; m++) {
    months.push({
      month: m,
      // Deep copy to ensure each month has independent entries
      items: generateDefaultItems().map(item => ({ ...item, id: `${item.id}_m${m}` }))
    });
  }

  return {
    year,
    months,
  };
};

export const exportToCSV = (data: FinanceData) => {
  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
  
  // Create rows for each month, aggregating data
  // Google Sheets usually likes rows for categories and columns for months or vice-versa
  
  csvContent += 'BẢNG THEO DÕI TÀI CHÍNH NĂM ' + data.year + '\n\n';
  
  const allGroups = ['Thu nhập vợ', 'Thu nhập chồng', 'Khác', 'Chi phí cố định', 'Sinh hoạt & Ăn uống', 'Cá nhân', 'Phát sinh', 'Tiết kiệm / Đầu tư'];
  
  // Headers
  let headerRow = 'Danh mục,';
  for (let m = 1; m <= 12; m++) {
    headerRow += `Tháng ${m} (Dự kiến),Tháng ${m} (Thực tế),`;
  }
  csvContent += headerRow + 'Tổng năm (Dự kiến),Tổng năm (Thực tế)\n';

  // Extract unique item names within groups
  const itemNamesByGroup: Record<string, string[]> = {};
  data.months[0].items.forEach(item => {
    if (!itemNamesByGroup[item.group]) {
      itemNamesByGroup[item.group] = [];
    }
    itemNamesByGroup[item.group].push(item.name);
  });

  allGroups.forEach(group => {
    csvContent += `${group.toUpperCase()}\n`;
    
    (itemNamesByGroup[group] || []).forEach(name => {
      let row = `${name},`;
      let yearExpected = 0;
      let yearActual = 0;
      
      for (let m = 1; m <= 12; m++) {
        const item = data.months[m - 1].items.find(i => i.name === name);
        if (item) {
          row += `${item.expected},${item.actual},`;
          yearExpected += item.expected;
          yearActual += item.actual;
        } else {
          row += '0,0,';
        }
      }
      row += `${yearExpected},${yearActual}\n`;
      csvContent += row;
    });
  });

  // Export
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `tai_chinh_${data.year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
