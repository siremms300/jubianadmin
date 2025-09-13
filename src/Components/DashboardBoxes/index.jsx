import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ShoppingCart, People, MonetizationOn, TrendingUp } from "@mui/icons-material";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const DashboardBoxes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const stats = [
    {
      title: "TOTAL SALES",
      value: 1250,
      icon: <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "NEW CUSTOMERS",
      value: 320,
      icon: <People sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "MONTHLY REVENUE",
      value: 58700,
      icon: <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      prefix: "$"
    },
    {
      title: "CONVERSION RATE",
      value: 7.8,
      icon: <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      suffix: "%",
      decimals: 1
    },
  ];

  // ✅ Mobile view: Swiper Carousel
  if (isMobile) {
    return (
      <Swiper spaceBetween={16} slidesPerView={1.2} centeredSlides={true}>
        {stats.map((stat, index) => (
          <SwiperSlide key={index}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: 3,
              background: stat.gradient,
              color: 'white',
              height: '140px'
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                      {stat.prefix || ''}
                      <CountUp
                        start={0}
                        end={stat.value}
                        duration={2.5}
                        separator=","
                        decimals={stat.decimals || 0}
                      />
                      {stat.suffix || ''}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  // ✅ Desktop grid view
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: stat.gradient,
            color: index === 3 ? '#333' : 'white',
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {stat.prefix || ''}
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      decimals={stat.decimals || 0}
                    />
                    {stat.suffix || ''}
                  </Typography>
                </Box>
                {stat.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardBoxes;














// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { ShoppingCart, People, BarChart, MonetizationOn } from "@mui/icons-material";
// import CountUp from "react-countup";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const DashboardBoxes = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const stats = [
//     {
//       title: "Total Sales",
//       value: 1250,
//       growth: "+15% from last week",
//       growthColor: "success.main",
//       icon: <ShoppingCart sx={{ fontSize: 28, color: "#fff" }} />,
//       color: "rgba(239, 121, 33, 0.9)",
//     },
//     {
//       title: "New Customers",
//       value: 320,
//       growth: "+8% from last week",
//       growthColor: "success.main",
//       icon: <People sx={{ fontSize: 28, color: "#fff" }} />,
//       color: "rgba(33, 150, 243, 0.9)",
//     },
//     {
//       title: "Monthly Revenue",
//       value: 58700,
//       growth: "+12% from last month",
//       growthColor: "success.main",
//       icon: <MonetizationOn sx={{ fontSize: 28, color: "#fff" }} />,
//       color: "rgba(76, 175, 80, 0.9)",
//     },
//     {
//       title: "Conversion Rate",
//       value: 7.8,
//       growth: "-2% from last week",
//       growthColor: "error.main",
//       icon: <BarChart sx={{ fontSize: 28, color: "#fff" }} />,
//       color: "rgba(156, 39, 176, 0.9)",
//     },
//   ];

//   // ✅ Mobile view: Swiper Carousel
//   if (isMobile) {
//     return (
//       <Swiper spaceBetween={16} slidesPerView={1}>
//         {stats.map((stat, index) => (
//           <SwiperSlide key={index}>
//             <Card
//               sx={{
//                 borderRadius: "12px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//                 marginBottom: "16px",
//                 borderLeft: `4px solid ${stat.color}`,
//               }}
//             >
//               <CardContent sx={{ padding: "20px" }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <Box>
//                     <Typography
//                       variant="h4"
//                       sx={{
//                         fontWeight: 700,
//                         color: "grey.800",
//                         fontSize: "2rem",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       <CountUp
//                         start={0}
//                         end={stat.value}
//                         duration={2.5}
//                         separator=","
//                         decimals={stat.title === "Conversion Rate" ? 1 : 0}
//                         suffix={stat.title === "Conversion Rate" ? "%" : ""}
//                       />
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "grey.600", fontWeight: 500, marginBottom: "8px" }}
//                     >
//                       {stat.title}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       sx={{ color: stat.growthColor, fontWeight: 500, display: "block" }}
//                     >
//                       {stat.growth}
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{
//                       backgroundColor: stat.color,
//                       borderRadius: "12px",
//                       padding: "12px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginLeft: "16px",
//                     }}
//                   >
//                     {stat.icon}
//                   </Box>
//                 </Box>
//               </CardContent>
//             </Card>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     );
//   }

//   // ✅ Desktop grid view
//   return (
//     <Grid container spacing={3} sx={{ width: "100%", margin: 0 }}>
//       {stats.map((stat, index) => (
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           md={3}
//           key={index}
//           sx={{ display: "flex" }}
//         >
//           <Card
//             sx={{
//               flex: 1,
//               borderRadius: "12px",
//               boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               borderLeft: `4px solid ${stat.color}`,
//               transition: "transform 0.2s, box-shadow 0.2s",
//               "&:hover": {
//                 transform: "translateY(-2px)",
//                 boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//               },
//             }}
//           >
//             <CardContent sx={{ padding: "20px" }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography
//                     variant="h4"
//                     sx={{
//                       fontWeight: 700,
//                       color: "grey.800",
//                       fontSize: "2rem",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <CountUp
//                       start={0}
//                       end={stat.value}
//                       duration={2.5}
//                       separator=","
//                       decimals={stat.title === "Conversion Rate" ? 1 : 0}
//                       suffix={stat.title === "Conversion Rate" ? "%" : ""}
//                     />
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "grey.600", fontWeight: 500, marginBottom: "8px" }}
//                   >
//                     {stat.title}
//                   </Typography>
//                   <Typography
//                     variant="caption"
//                     sx={{ color: stat.growthColor, fontWeight: 500, display: "block" }}
//                   >
//                     {stat.growth}
//                   </Typography>
//                 </Box>
//                 <Box
//                   sx={{
//                     backgroundColor: stat.color,
//                     borderRadius: "12px",
//                     padding: "12px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     marginLeft: "16px",
//                   }}
//                 >
//                   {stat.icon}
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default DashboardBoxes;














// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Grid
// } from '@mui/material';
// import {
//   People,
//   Receipt,
//   Inventory,
//   Category,
//   ChevronLeft,
//   ChevronRight
// } from '@mui/icons-material';

// const DashboardBoxes = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const stats = [
//     {
//       title: 'Total Users',
//       value: '2980',
//       icon: <People sx={{ fontSize: 40, color: '#4f46e5' }} />,
//       color: '#eef2ff',
//       growth: '+12% from last month',
//       growthColor: '#10b981'
//     },
//     {
//       title: 'Total Orders',
//       value: '765',
//       icon: <Receipt sx={{ fontSize: 40, color: '#10b981' }} />,
//       color: '#ecfdf5',
//       growth: '+8% from last month',
//       growthColor: '#10b981'
//     },
//     {
//       title: 'Total Products',
//       value: '50',
//       icon: <Inventory sx={{ fontSize: 40, color: '#f59e0b' }} />,
//       color: '#fffbeb',
//       growth: '+2 new this week',
//       growthColor: '#10b981'
//     },
//     {
//       title: 'Total Category',
//       value: '8',
//       icon: <Category sx={{ fontSize: 40, color: '#ef4444' }} />,
//       color: '#fef2f2',
//       growth: 'No change recently',
//       growthColor: '#6b7280'
//     }
//   ];

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Auto-rotate for carousel effect
//   useEffect(() => {
//     if (isMobile) {
//       const interval = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % stats.length);
//       }, 3000);
      
//       return () => clearInterval(interval);
//     }
//   }, [isMobile, stats.length]);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % stats.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + stats.length) % stats.length);
//   };

//   if (isMobile) {
//     // Mobile carousel view
//     return (
//       <Box sx={{ position: 'relative', marginBottom: '24px' }}>
//         <Card 
//           sx={{ 
//             borderRadius: '12px', 
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             borderLeft: `4px solid ${stats[currentIndex].icon.props.sx.color}`,
//             transition: 'all 0.3s ease'
//           }}
//         >
//           <CardContent sx={{ padding: '20px' }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//               <Box sx={{ flex: 1 }}>
//                 <Typography 
//                   variant="h4" 
//                   sx={{ 
//                     fontWeight: 700, 
//                     color: 'grey.800',
//                     fontSize: '2rem',
//                     marginBottom: '8px'
//                   }}
//                 >
//                   {stats[currentIndex].value}
//                 </Typography>
//                 <Typography 
//                   variant="body2" 
//                   sx={{ 
//                     color: 'grey.600',
//                     fontWeight: 500,
//                     marginBottom: '8px'
//                   }}
//                 >
//                   {stats[currentIndex].title}
//                 </Typography>
//                 <Typography 
//                   variant="caption" 
//                   sx={{ 
//                     color: stats[currentIndex].growthColor,
//                     fontWeight: 500,
//                     display: 'block'
//                   }}
//                 >
//                   {stats[currentIndex].growth}
//                 </Typography>
//               </Box>
//               <Box 
//                 sx={{ 
//                   backgroundColor: stats[currentIndex].color,
//                   borderRadius: '12px',
//                   padding: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginLeft: '16px'
//                 }}
//               >
//                 {stats[currentIndex].icon}
//               </Box>
//             </Box>
//           </CardContent>
//         </Card>

//         {/* Navigation dots */}
//         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
//           {stats.map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: '8px',
//                 height: '8px',
//                 borderRadius: '50%',
//                 backgroundColor: index === currentIndex ? '#4f46e5' : '#d1d5db',
//                 cursor: 'pointer'
//               }}
//               onClick={() => setCurrentIndex(index)}
//             />
//           ))}
//         </Box>

//         {/* Navigation arrows */}
//         <IconButton
//           sx={{
//             position: 'absolute',
//             left: '-20px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             backgroundColor: 'white',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             '&:hover': { backgroundColor: 'grey.50' }
//           }}
//           onClick={prevSlide}
//         >
//           <ChevronLeft />
//         </IconButton>
//         <IconButton
//           sx={{
//             position: 'absolute',
//             right: '-20px',
//             top: '50%',
//             transform: 'translateY(-50%)',
//             backgroundColor: 'white',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             '&:hover': { backgroundColor: 'grey.50' }
//           }}
//           onClick={nextSlide}
//         >
//           <ChevronRight />
//         </IconButton>
//       </Box>
//     );
//   }

//   // Desktop grid view (original layout)
//   return (
//     <Grid container spacing={3}>
//       {stats.map((stat, index) => (
//         <Grid item xs={12} sm={6} md={3} key={index}>
//           <Card 
//             sx={{ 
//               borderRadius: '12px', 
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//               borderLeft: `4px solid ${stat.icon.props.sx.color}`,
//               height: '100%',
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-2px)',
//                 boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
//               }
//             }}
//           >
//             <CardContent sx={{ padding: '20px' }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography 
//                     variant="h4" 
//                     sx={{ 
//                       fontWeight: 700, 
//                       color: 'grey.800',
//                       fontSize: '2rem',
//                       marginBottom: '8px'
//                     }}
//                   >
//                     {stat.value}
//                   </Typography>
//                   <Typography 
//                     variant="body2" 
//                     sx={{ 
//                       color: 'grey.600',
//                       fontWeight: 500,
//                       marginBottom: '8px'
//                     }}
//                   >
//                     {stat.title}
//                   </Typography>
//                   <Typography 
//                     variant="caption" 
//                     sx={{ 
//                       color: stat.growthColor,
//                       fontWeight: 500,
//                       display: 'block'
//                     }}
//                   >
//                     {stat.growth}
//                   </Typography>
//                 </Box>
//                 <Box 
//                   sx={{ 
//                     backgroundColor: stat.color,
//                     borderRadius: '12px',
//                     padding: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     marginLeft: '16px'
//                   }}
//                 >
//                   {stat.icon}
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default DashboardBoxes;