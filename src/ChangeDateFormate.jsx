import React from 'react';
import { format } from 'date-fns';

const ChangeDateFormate = ({ date }) => {
  // Format the date
  const formattedDate = format(new Date(date), "d-M-yyyy hh:mm:ss a");

  return (
    <span>
      {formattedDate}
    </span>
  );
};

export default ChangeDateFormate;
