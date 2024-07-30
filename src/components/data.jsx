/* export const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
  },
  {
    name: 'Full Name',
    selector: row => row.fullName,
    sortable: true,
  },
  {
    name: 'Height',
    selector: row => row.height,
    sortable: true,
  },
  {
    name: 'Weight',
    selector: row => row.weight,
    sortable: true,
  },
  {
    name: 'Amount_Paid',
    selector: row => row.details.paid,
    sortable: true,
  },
]; */

/* export const rows = [
  { id: 1, fullName: "John Doe", height: "1.75m", weight: "89kg", details: { paid: 400, unpaid: 600, extra: { info: "More info about John Doe" } } },
  { id: 2, fullName: "Jane Doe", height: "1.64m", weight: "55kg", details: { paid: 300, unpaid: 700, extra: { info: "More info about Jane Doe" } } },
  { id: 3, fullName: "Sheera Maine", height: "1.69m", weight: "74kg", details: { paid: 450, unpaid: 550, extra: { info: "More info about Sheera Maine" } } },
  { id: 4, fullName: "Paul Smith", height: "1.80m", weight: "80kg", details: { paid: 350, unpaid: 650, extra: { info: "More info about Paul Smith" } } },
  { id: 5, fullName: "Laura Lee", height: "1.58m", weight: "60kg", details: { paid: 500, unpaid: 500, extra: { info: "More info about Laura Lee" } } },
  { id: 6, fullName: "Tom Harris", height: "1.90m", weight: "95kg", details: { paid: 400, unpaid: 600, extra: { info: "More info about Tom Harris" } } },
  { id: 7, fullName: "Lisa Ray", height: "1.70m", weight: "65kg", details: { paid: 370, unpaid: 630, extra: { info: "More info about Lisa Ray" } } },
  { id: 8, fullName: "Michael Clark", height: "1.85m", weight: "85kg", details: { paid: 480, unpaid: 520,extra: { info: "More info about Michael Clark" } } },
  { id: 9, fullName: "Nancy Drew", height: "1.62m", weight: "52kg", details: { paid: 420, unpaid: 580, extra: { info: "More info about Nancy Drew" } } },
  { id: 10, fullName: "George Bush", height: "1.78m", weight: "88kg", details: { paid: 440, unpaid: 560, extra: { info: "More info about George Bush" } } },
  { id: 11, fullName: "Sam Wilson", height: "1.76m", weight: "82kg", details: { paid: 460, unpaid: 540, extra: { info: "More info about Sam Wilson" } } },
  { id: 12, fullName: "Emma Stone", height: "1.65m", weight: "58kg", details: { paid: 380, unpaid: 620, extra: { info: "More info about Emma Stone" } } },
  { id: 13, fullName: "Robert Brown", height: "1.82m", weight: "90kg", details: { paid: 490, unpaid: 510, extra: { info: "More info about Robert Brown" } } },
  { id: 14, fullName: "Jessica Jones", height: "1.60m", weight: "54kg", details: { paid: 410, unpaid: 590, extra: { info: "More info about Jessica Jones" } } },
  { id: 15, fullName: "Chris Evans", height: "1.92m", weight: "98kg", details: { paid: 450, unpaid: 550, extra: { info: "More info about Chris Evans" } } },
  { id: 16, fullName: "Sophia Loren", height: "1.68m", weight: "64kg", details: { paid: 400, unpaid: 600, extra: { info: "More info about Sophia Loren" } } },
  { id: 17, fullName: "Jack Daniels", height: "1.74m", weight: "70kg", details: { paid: 470, unpaid: 530, extra: { info: "More info about Jack Daniels" } } },
  { id: 18, fullName: "Anna Kendrick", height: "1.66m", weight: "57kg", details: { paid: 430, unpaid: 570, extra: { info: "More info about Anna Kendrick" } } },
  { id: 19, fullName: "Peter Parker", height: "1.79m", weight: "78kg", details: { paid: 390, unpaid: 610, extra: { info: "More info about Peter Parker" } } },
  { id: 20, fullName: "Bruce Wayne", height: "1.87m", weight: "92kg", details: { paid: 480, unpaid: 520, extra: { info: "More info about Bruce Wayne" } } },
]; */
export const dynamicNestedColumns = [
    { name: "Total Count", selector: (row) => row.total_count, sortable: true },
    { name: "Total Pos", selector: (row) => row.total_pos, sortable: true },
    { name: "Resolved Pos", selector: (row) => row.resolved_pos, sortable: true },
  ];
  
  export const columns1 = [
    { name: 'A', selector: row => row.column1, sortable: true },
    { name: 'B', selector: row => row.column2, sortable: true },
  ];
  
  export const rows1 = [
    { column1: 'Row1 Data1', column2: 'Row1 Data2' },
    { column1: 'Row2 Data1', column2: 'Row2 Data2' },
  ];
  
  
 export const dynamicColumns = (data) => {
    if (!data || data.length === 0) return [];
  
    return Object.keys(data[0]).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      selector: row => row[key],
      sortable: true,
      minWidth: '150px',
    }));
  }; 



  
  
  
  
  