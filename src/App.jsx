import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
import Dashboard from './Pages/Dashboard';
import ProductList from './Pages/ProductList';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import AddProduct from './Pages/AddProduct'; 
import CategoryList from './Pages/CategoryList';
import SubCategory from './Pages/SubCategory';
import Users from './Pages/Users';
import Orders from './Pages/Orders';
import HomeBanners from './Pages/HomeBanners';
import SubBanner from './Pages/SubBanner';
import ManageLogo from './Pages/ManageLogo';

function App() { 
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const router = createBrowserRouter([
    {
      path: '/', 
      element: (
        <div className="min-h-screen bg-gray-100">
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <Sidebar isOpen={sidebarOpen} />
          <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className='p-6'>
              <Dashboard />
            </div>
          </main>
        </div>
      )
    },
    {
      path: '/products', 
      element: (
        <div className="min-h-screen bg-gray-100">
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <Sidebar isOpen={sidebarOpen} />
          <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className='p-6'>
              <ProductList />
            </div>
          </main>
        </div>
      )
    },
    {
    path: '/product/upload',
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <AddProduct />
          </div>
        </main>
      </div>
    )
  },

  {
    path: '/categories', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <CategoryList />
          </div>
        </main>
      </div>
    )
  },
  {
    path: '/category/subCat', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <SubCategory />
          </div>
        </main>
      </div>
    )
  },

  // In App.js, add this route to the router configuration
  {
    path: '/users', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <Users />
          </div>
        </main>
      </div>
    )
  },
  {
    path: '/orders', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <Orders />
          </div>
        </main>
      </div>
    )
  },
  
  {
    path: '/home-banners', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <HomeBanners />
          </div>
        </main>
      </div>
    )
  },
  // In App.js, add this route to the router configuration
  {
    path: '/sub-banner', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <SubBanner />
          </div>
        </main>
      </div>
    )
  },
  // In App.js, add this route to the router configuration
  {
    path: '/manage-logo', 
    element: (
      <div className="min-h-screen bg-gray-100">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />
        <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className='p-6'>
            <ManageLogo />
          </div>
        </main>
      </div>
    )
  }
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;



















// import React, { useState } from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 
// import Dashboard from './Pages/Dashboard';
// import Header from './Components/Header';
// import Sidebar from './Components/Sidebar';
// import ProductList from './Pages/ProductList';

// function App() { 
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const router = createBrowserRouter([{
//     path: '/', 
//     exact: true, 
//     element: (
//       <div className="min-h-screen bg-gray-100">
//         <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
//         <Sidebar isOpen={sidebarOpen} />
//         <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
//           <div className='p-6'>
//             <Dashboard />
//           </div>
//         </main>
//       </div>
//     )
//   }]);

//   return (
//     <>
//       <RouterProvider router={router}/>
//     </>
//   );
// }

// export default App;