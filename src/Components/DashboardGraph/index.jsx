import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from "recharts";

const DashboardGraph = () => {
  // Sample datasets
  const weeklyData = [
    { label: "Mon", users: 400, sales: 15 },
    { label: "Tue", users: 520, sales: 18 },
    { label: "Wed", users: 610, sales: 22 },
    { label: "Thu", users: 720, sales: 20 },
    { label: "Fri", users: 800, sales: 25 },
    { label: "Sat", users: 690, sales: 19 },
    { label: "Sun", users: 750, sales: 21 }
  ];

  const monthlyData = [
    { label: "Jan", users: 2200, sales: 65 },
    { label: "Feb", users: 2400, sales: 78 },
    { label: "Mar", users: 2600, sales: 90 },
    { label: "Apr", users: 2750, sales: 81 },
    { label: "May", users: 2850, sales: 56 },
    { label: "Jun", users: 2900, sales: 55 },
    { label: "Jul", users: 2980, sales: 40 }
  ];

  const yearlyData = [
    { label: "2019", users: 18000, sales: 500 },
    { label: "2020", users: 22000, sales: 750 },
    { label: "2021", users: 25000, sales: 900 },
    { label: "2022", users: 27000, sales: 1100 },
    { label: "2023", users: 29800, sales: 1250 }
  ];

  // State for dataset selection
  const [view, setView] = useState("monthly");

  const getData = () => {
    switch (view) {
      case "weekly":
        return weeklyData;
      case "yearly":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
        marginTop: "24px"
      }}
    >
      <CardContent sx={{ padding: "16px" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.800" }}>
            Users vs Sales Performance
          </Typography>
          <TrendingUp sx={{ color: "primary.main" }} />
        </Box>

        {/* Toggle buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            size="small"
          >
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="yearly">Yearly</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Chart */}
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={getData()}
              key={view} // force smooth re-animate on dataset change
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff"
                }}
              />
              <Legend />
              <Bar
                dataKey="users"
                barSize={24}
                fill="#4f46e5"
                name="Total Users"
                radius={[6, 6, 0, 0]}
                animationDuration={1200}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#ef7921"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Total Sales"
                animationDuration={1500}
                animationBegin={300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardGraph;














// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography
// } from "@mui/material";
// import {
//   TrendingUp
// } from "@mui/icons-material";
// import {
//   ResponsiveContainer,
//   ComposedChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Bar,
//   Line
// } from "recharts";

// const DashboardGraph = () => {
//   // Sample data
//   const chartData = [
//     { month: "Jan", users: 2200, sales: 65 },
//     { month: "Feb", users: 2400, sales: 78 },
//     { month: "Mar", users: 2600, sales: 90 },
//     { month: "Apr", users: 2750, sales: 81 },
//     { month: "May", users: 2850, sales: 56 },
//     { month: "Jun", users: 2900, sales: 55 },
//     { month: "Jul", users: 2980, sales: 40 }
//   ];

//   return (
//     <Card
//       sx={{
//         borderRadius: "12px",
//         boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
//         marginTop: "24px"
//       }}
//     >
//       <CardContent sx={{ padding: "16px" }}>
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "16px"
//           }}
//         >
//           <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.800" }}>
//             Users vs Sales Performance
//           </Typography>
//           <TrendingUp sx={{ color: "primary.main" }} />
//         </Box>

//         {/* Chart */}
//         <Box sx={{ width: "100%", height: 300 }}>
//           <ResponsiveContainer>
//             <ComposedChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip
//                 contentStyle={{
//                   borderRadius: "8px",
//                   border: "1px solid #e0e0e0",
//                   backgroundColor: "#fff"
//                 }}
//               />
//               <Legend />
//               <Bar
//                 dataKey="users"
//                 barSize={24}
//                 fill="#4f46e5"
//                 name="Total Users"
//                 radius={[6, 6, 0, 0]}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="sales"
//                 stroke="#ef7921"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 name="Total Sales"
//               />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </Box>

//         {/* Current Stats */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-around",
//             marginTop: "16px",
//             padding: "12px",
//             backgroundColor: "grey.50",
//             borderRadius: "8px"
//           }}
//         >
//           <Box sx={{ textAlign: "center" }}>
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 600, color: "#4f46e5" }}
//             >
//               2,980
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "grey.600", fontSize: "0.8rem" }}
//             >
//               Current Users
//             </Typography>
//           </Box>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 600, color: "#ef7921" }}
//             >
//               765
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{ color: "grey.600", fontSize: "0.8rem" }}
//             >
//               Total Sales
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default DashboardGraph;














// // import React from 'react'; 
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography
// // } from '@mui/material';
// // import {
// //   TrendingUp
// // } from '@mui/icons-material';

// // const DashboardGraph = () => {
// //   // Sample data - users and sales for each month
// //   const chartData = [
// //     { month: 'Jan', users: 2200, sales: 65 },
// //     { month: 'Feb', users: 2400, sales: 78 },
// //     { month: 'Mar', users: 2600, sales: 90 },
// //     { month: 'Apr', users: 2750, sales: 81 },
// //     { month: 'May', users: 2850, sales: 56 },
// //     { month: 'Jun', users: 2900, sales: 55 },
// //     { month: 'Jul', users: 2980, sales: 40 }
// //   ];

// //   // Find max values for scaling
// //   const maxUsers = Math.max(...chartData.map(item => item.users));
// //   const maxSales = Math.max(...chartData.map(item => item.sales));

// //   return (
// //     <Card sx={{ 
// //       borderRadius: '12px', 
// //       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
// //       marginTop: '24px'
// //     }}>
// //       <CardContent sx={{ padding: '16px' }}>
// //         {/* Header */}
// //         <Box sx={{ 
// //           display: 'flex', 
// //           justifyContent: 'space-between', 
// //           alignItems: 'center',
// //           marginBottom: '16px'
// //         }}>
// //           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
// //             Users vs Sales Performance
// //           </Typography>
// //           <TrendingUp sx={{ color: 'primary.main' }} />
// //         </Box>

// //         {/* Chart Container */}
// //         <Box sx={{ 
// //           display: 'flex', 
// //           alignItems: 'end', 
// //           height: '200px',
// //           gap: '12px',
// //           padding: '16px 0'
// //         }}>
// //           {chartData.map((item, index) => (
// //             <Box key={index} sx={{ 
// //               display: 'flex', 
// //               flexDirection: 'column', 
// //               alignItems: 'center', 
// //               flex: 1,
// //               height: '100%'
// //             }}>
// //               {/* Users Bar */}
// //               <Box
// //                 sx={{
// //                   height: `${(item.users / maxUsers) * 70}%`,
// //                   backgroundColor: '#4f46e5',
// //                   width: '12px',
// //                   borderRadius: '4px 4px 0 0',
// //                   marginBottom: '8px'
// //                 }}
// //               />
              
// //               {/* Sales Bar */}
// //               <Box
// //                 sx={{
// //                   height: `${(item.sales / maxSales) * 70}%`,
// //                   backgroundColor: '#ef7921',
// //                   width: '12px',
// //                   borderRadius: '4px 4px 0 0'
// //                 }}
// //               />
              
// //               {/* Month Label */}
// //               <Typography variant="caption" sx={{ 
// //                 marginTop: '8px', 
// //                 color: 'grey.600',
// //                 fontSize: '0.7rem'
// //               }}>
// //                 {item.month}
// //               </Typography>
// //             </Box>
// //           ))}
// //         </Box>

// //         {/* Legend */}
// //         <Box sx={{ 
// //           display: 'flex', 
// //           justifyContent: 'center', 
// //           gap: '24px',
// //           marginTop: '16px',
// //           paddingTop: '16px',
// //           borderTop: '1px solid',
// //           borderColor: 'grey.100'
// //         }}>
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //             <Box sx={{ 
// //               width: '12px', 
// //               height: '12px', 
// //               backgroundColor: '#4f46e5',
// //               borderRadius: '2px'
// //             }} />
// //             <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
// //               Total Users
// //             </Typography>
// //           </Box>
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
// //             <Box sx={{ 
// //               width: '12px', 
// //               height: '12px', 
// //               backgroundColor: '#ef7921',
// //               borderRadius: '2px'
// //             }} />
// //             <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
// //               Total Sales
// //             </Typography>
// //           </Box>
// //         </Box>

// //         {/* Current Stats */}
// //         <Box sx={{ 
// //           display: 'flex', 
// //           justifyContent: 'space-around',
// //           marginTop: '16px',
// //           padding: '12px',
// //           backgroundColor: 'grey.50',
// //           borderRadius: '8px'
// //         }}>
// //           <Box sx={{ textAlign: 'center' }}>
// //             <Typography variant="h6" sx={{ fontWeight: 600, color: '#4f46e5' }}>
// //               2,980
// //             </Typography>
// //             <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
// //               Current Users
// //             </Typography>
// //           </Box>
// //           <Box sx={{ textAlign: 'center' }}>
// //             <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef7921' }}>
// //               765
// //             </Typography>
// //             <Typography variant="body2" sx={{ color: 'grey.600', fontSize: '0.8rem' }}>
// //               Total Sales
// //             </Typography>
// //           </Box>
// //         </Box>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default DashboardGraph;