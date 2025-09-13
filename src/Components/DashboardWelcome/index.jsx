import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DashboardWelcome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <Card
      className="rounded-2xl shadow-md border-0 mb-8"
      sx={{
        background: "##F5F0F0",
        // background: "linear-gradient(135deg, #fff7f0, #ffe4d1)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Greeting & Subtext */}
          <Box>
            <Typography
              variant="h4"
              className="font-extrabold text-gray-800 mb-2"
              sx={{
                fontSize: { xs: "1.6rem", md: "2rem" },
                letterSpacing: "-0.5px",
              }}
            >
              {getGreeting()}, Admin 👋
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600"
              sx={{ fontSize: "1rem" }}
            >
              Here’s what’s happening with your store today.
            </Typography>
          </Box>

          {/* Date & Time */}
          <Box
            className="px-4 py-3 rounded-xl shadow-sm"
            sx={{
              backgroundColor: "#ffffffcc",
              backdropFilter: "blur(6px)",
              border: "1px solid #f1f1f1",
              textAlign: "right",
              minWidth: "220px",
            }}
          >
            <Typography
              variant="body2"
              className="text-gray-500"
              sx={{ fontSize: "0.95rem" }}
            >
              {formatDate(currentTime)}
            </Typography>
            <Typography
              variant="h6"
              className="font-semibold text-gray-800"
              sx={{ fontSize: "1.4rem", mt: 0.5 }}
            >
              {formatTime(currentTime)}
            </Typography>
          </Box>
        </Box>

        {/* CTA Button */}
        <Box className="mt-8">
          <Button
            variant="contained"
            startIcon={<Add />}
            className="rounded-xl font-semibold shadow-md"
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "0.95rem",
              background: "linear-gradient(90deg, #f97316, #ea580c)",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(90deg, #ea580c, #c2410c)",
                boxShadow: "0 4px 14px rgba(234, 88, 12, 0.3)",
              },
            }}
            onClick={()=> navigate('/product/upload')}
          >
            Add Product
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcome;








// import React, { useState, useEffect } from 'react';
// import { Box, Typography, Button, Card, CardContent } from '@mui/material';
// import { Add } from '@mui/icons-material';

// const DashboardWelcome = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, []);
  
//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };
  
//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true 
//     });
//   };

//   // Function to get time-based greeting
//   const getGreeting = () => {
//     const hour = currentTime.getHours();
    
//     if (hour >= 5 && hour < 12) {
//       return 'Good morning';
//     } else if (hour >= 12 && hour < 17) {
//       return 'Good afternoon';
//     } else if (hour >= 17 && hour < 21) {
//       return 'Good evening';
//     } else {
//       return 'Good night';
//     }
//   };

//   return (
//     <Card className="rounded-xl shadow-sm bg-gradient-to-r from-white to-orange-50 border-0 mb-6">
//       <CardContent className="p-6">
//         <Box className="flex flex-col md:flex-row justify-between items-start md:items-center">
//           <Box>
//             <Typography 
//               variant="h4" 
//               className="font-bold text-gray-800 mb-2"
//               sx={{ fontSize: '1.8rem' }}
//             >
//               {getGreeting()}, Admin!
//             </Typography>
//             <Typography variant="body1" className="text-gray-600">
//               Here's what's happening with your store today.
//             </Typography>
//           </Box>
          
//           <Box className="mt-4 md:mt-0 text-right">
//             <Typography variant="body2" className="text-gray-500">
//               {formatDate(currentTime)}
//             </Typography>
//             <Typography 
//               variant="h6" 
//               className="font-semibold text-gray-800"
//               sx={{ fontSize: '1.2rem' }}
//             >
//               {formatTime(currentTime)}
//             </Typography>
//           </Box>
//         </Box>
        
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           className="mt-6 rounded-lg py-2 px-4 font-medium"
//           sx={{
//             backgroundColor: '#ef7921',
//             '&:hover': {
//               backgroundColor: '#e06b15',
//             }
//           }}
//         >
//           ADD PRODUCT
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default DashboardWelcome;