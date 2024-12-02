// import React from 'react';
// import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs';
// import { Skeleton } from '@/components/ui/skeleton';

// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-LK', {
//     style: 'currency',
//     currency: 'LKR',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(amount);

// };

// const StatisticCard = ({
//   title,
//   currentAmount = 0,
//   previousAmount = 0,
//   comparisonMonth = '',
//   isLoading = false,
//   prefix = 'LKR',
//   showCurrency = true,
//   customClass = '',
//   decimalPlaces = 2
// }) => {
//   // Calculate percentage change
//   const percentageChange = previousAmount
//     ? ((currentAmount - previousAmount) / previousAmount * 100).toFixed(1)
//     : 0;

//   const isPositive = percentageChange >= 0;

//   // Format the amount based on whether it should show currency
//   const formatAmount = (amount) => {
//     if (showCurrency) {
//       return formatCurrency(amount);
//     }
//     return `${prefix} ${amount.toFixed(decimalPlaces)}`;
//   };

//   if (isLoading) {
//     return (
//       <div className={`d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3 ${customClass}`}>
//         <div className="w-full">
//           <Skeleton className="h-4 w-24 mb-2" />
//           <Skeleton className="h-8 w-32" />
//         </div>
//         <div className="flex flex-col items-end">
//           <Skeleton className="h-4 w-16 mb-2" />
//           <Skeleton className="h-4 w-32" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3 ${customClass}`}>
//       <div>
//         <p className="text-sm text-gray-500 mb-1">{title}</p>
//         <h4 className="text-2xl font-semibold mb-0">
//           {formatAmount(currentAmount)}
//         </h4>
//       </div>
//       <div className="d-flex flex-column align-items-end">
//         <div className={`flex items-center gap-1 text-sm font-medium ${
//           isPositive ? 'text-green-600' : 'text-red-600'
//         }`}>
//           {isPositive ? (
//             <BsArrowUpRight className="w-4 h-4" />
//           ) : (
//             <BsArrowDownRight className="w-4 h-4" />
//           )}
//           {Math.abs(percentageChange)}%
//         </div>
//         <p className="text-xs text-gray-500 mb-0">
//           Compared To {comparisonMonth}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StatisticCard;

import React from "react";
import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const StatisticCard = ({
  title,
  currentAmount = 0,
  previousAmount = 0,
  comparisonMonth = "",
  isLoading = false,
  prefix = "LKR",
  showCurrency = true,
  customClass = "",
  decimalPlaces = 2,
}) => {
  // Calculate percentage change
  const percentageChange = previousAmount
    ? (((currentAmount - previousAmount) / previousAmount) * 100).toFixed(1)
    : 0;

  const isPositive = percentageChange >= 0;

  // Format the amount based on whether it should show currency
  const formatAmount = (amount) => {
    if (showCurrency) {
      return formatCurrency(amount);
    }
    return `${prefix} ${amount.toFixed(decimalPlaces)}`;
  };

  if (isLoading) {
    return (
      <div
        className={`d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3 ${customClass}`}
      >
        <div>
          <div className="bg-gray-200 h-4 w-24 mb-2 animate-pulse rounded"></div>
          <div className="bg-gray-200 h-8 w-32 animate-pulse rounded"></div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <div className="bg-gray-200 h-4 w-16 mb-2 animate-pulse rounded"></div>
          <div className="bg-gray-200 h-4 w-32 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3 ${customClass}`}
      style={{ width: "350px" }}
    >
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-semibold mb-0">
          {formatAmount(currentAmount)}
        </h4>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div
          className={`d-flex align-items-center gap-1 ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? (
            <BsArrowUpRight className="w-4 h-4" />
          ) : (
            <BsArrowDownRight className="w-4 h-4" />
          )}
          {Math.abs(percentageChange)}%
        </div>
        <p className="text-xs text-gray-500 mb-0">
          Compared To {comparisonMonth}
        </p>
      </div>
    </div>
  );
};

export default StatisticCard;
