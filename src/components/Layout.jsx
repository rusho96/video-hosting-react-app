
import React, {useState} from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {Link, NavLink, Outlet} from "react-router-dom"





const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
  
      <Header className="fixed top-0 left-0 right-0 h-14 z-20" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        
        <Sidebar toggle={sidebarOpen} />
        
        
        <main className="flex-1 overflow-y-auto pt-0">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Layout