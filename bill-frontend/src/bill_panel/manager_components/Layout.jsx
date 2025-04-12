// src/components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="content">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
