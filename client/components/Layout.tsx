import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="Layout" style={{ marginLeft: '20px' }}>
    <header><i>People Query Tool</i></header>
    <main>{children}</main>
  </div>
);

export default Layout;
