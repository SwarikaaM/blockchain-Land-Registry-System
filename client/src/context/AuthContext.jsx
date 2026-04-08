import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dlr_token'));
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const truncatedWallet = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : null;

  // Restore session on mount
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user || res.data.data || res.data);
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              const provider = new BrowserProvider(window.ethereum);
              const bal = await provider.getBalance(accounts[0]);
              setBalance(parseFloat((Number(bal) / 1e18).toFixed(4)));
              const network = await provider.getNetwork();
              setChainId(Number(network.chainId));
            }
          }
        } catch {
          localStorage.removeItem('dlr_token');
          localStorage.removeItem('dlr_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for wallet changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccounts = (accounts) => { if (accounts.length === 0) logout(); else setWallet(accounts[0]); };
    const handleChain = (hex) => setChainId(parseInt(hex, 16));
    window.ethereum.on('accountsChanged', handleAccounts);
    window.ethereum.on('chainChanged', handleChain);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccounts);
      window.ethereum.removeListener('chainChanged', handleChain);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Connect wallet + SIWE auth
  const connectWallet = useCallback(async (role = 'buyer') => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this application.');
      return;
    }
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      setWallet(address);

      const provider = new BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(address);
      setBalance(parseFloat((Number(bal) / 1e18).toFixed(4)));
      const network = await provider.getNetwork();
      setChainId(Number(network.chainId));

      // Backend returns { success, nonce, message }
      const nonceRes = await authAPI.getNonce(address);
      const siweMessage = nonceRes.data.message;

      // Sign the SIWE message
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(siweMessage);

      // Verify with backend => JWT, pass role for new user assignment
      const authRes = await authAPI.verifySignature({ message: siweMessage, signature, role });
      const jwt = authRes.data.token;
      const userData = authRes.data.user;

      localStorage.setItem('dlr_token', jwt);
      localStorage.setItem('dlr_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dlr_token');
    localStorage.removeItem('dlr_user');
    setToken(null);
    setUser(null);
    setWallet(null);
    setBalance(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, wallet, truncatedWallet, balance, chainId, isAuthenticated, loading, connectWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
