import React from 'react';

interface FooterLandingPageProps {
  style?: React.CSSProperties;
}

const FooterLandingPage: React.FC<FooterLandingPageProps> = ({ style }) => {
  return (
    <footer className="bg-[#5E9ED9] text-white text-center p-10" style={style}>
      <p className="text-sm">© CS490 Group 1</p>
    </footer>
  );
};

export default FooterLandingPage;
