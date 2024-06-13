
import * as XLSX from 'xlsx';
export const downloadExcel = (filteredLogs,dynamicFileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const currentTime = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, ''); // Get current time in HHMMSS format
    const fileName = `${dynamicFileName}_${currentDate}_${currentTime}`; // Construct file name with current date and time
    const ws = XLSX.utils.json_to_sheet(filteredLogs);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName + fileExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};