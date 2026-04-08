// Centralized navbar configuration to eliminate repetition
export const NAVBAR_CONFIG = {
  BUYER: {
    links: [
      { to: '/buyer', label: 'Dashboard' },
      { to: '/buyer/transfers', label: 'Transfers' },
      { to: '/buyer/documents', label: 'Documents' }
    ],
    activeClass: 'text-[#7C5CFF] border-b-2 border-[#7C5CFF] pb-1',
    inactiveClass: 'text-[#e5e4ed]/60 hover:text-[#e5e4ed]'
  },
  SELLER: {
    links: [
      { to: '/seller', label: 'Dashboard' },
      { to: '/seller/transfers', label: 'Transfers' },
      { to: '/seller/documents', label: 'Documents' }
    ],
    activeClass: 'text-[#7C5CFF] border-b-2 border-[#7C5CFF] pb-1',
    inactiveClass: 'text-[#e5e4ed]/60 hover:text-[#e5e4ed]'
  },
  OFFICER: {
    links: [
      { to: '/officer', label: 'Dashboard' },
      { to: '/cases', label: 'Cases' },
      { to: '/officer/documents', label: 'Documents' }
    ],
    activeClass: 'text-[#7C5CFF] border-b-2 border-[#7C5CFF] pb-1',
    inactiveClass: 'text-[#e5e4ed]/60 hover:text-[#e5e4ed]'
  }
};

export const getNavbarConfig = (role) => {
  return NAVBAR_CONFIG[role.toUpperCase()] || NAVBAR_CONFIG.BUYER;
};
