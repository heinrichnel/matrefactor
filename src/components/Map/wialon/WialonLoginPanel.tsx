import React, { useState, useEffect } from "react";
import { loginWialon, logoutWialon, getCurrentWialonUser, loadWialonSDK } from "../utils/wialonAuth";
import { WIALON_SESSION_TOKEN, openWialonLogin } from "../utils/wialonConfig";

// Use the token from environment variables or fallback to default
const DEFAULT_TOKEN = WIALON_SESSION_TOKEN || "c1099bc37c906fd0832d8e783b60ae0d30936747FF150CC77961EAF35CBC1E2E71BD55AF";

export const WialonLoginPanel: React.FC = () => {
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [log, setLog] = useState<string[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load Wialon SDK on component mount
  useEffect(() => {
    const loadSDK = async () => {
      try {
        setIsLoading(true);
        appendLog("Loading Wialon SDK...");
        await loadWialonSDK();
        appendLog("Wialon SDK loaded successfully");
        // Check if already logged in
        const currentUser = getCurrentWialonUser();
        if (currentUser) {
          setUser(currentUser);
          appendLog(`Already logged in as: ${currentUser}`);
        }
      } catch (err) {
        appendLog(`Failed to load Wialon SDK: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSDK();
  }, []);

  const appendLog = (msg: string) =>
    setLog(prev => [msg, ...prev.slice(0, 20)]);

  const handleLogin = async () => {
    if (!token.trim()) {
      appendLog("Please enter a valid token");
      return;
    }
    
    try {
      setIsLoading(true);
      appendLog("Attempting login...");
      const msg = await loginWialon(token);
      appendLog(msg);
      setUser(getCurrentWialonUser());
    } catch (err) {
      appendLog(`Login failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      appendLog("Logging out...");
      const msg = await logoutWialon();
      appendLog(msg);
      setUser(getCurrentWialonUser());
    } catch (err) {
      appendLog(`Logout failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUser = () => {
    const username = getCurrentWialonUser();
    if (username) appendLog(`Logged in as: ${username}`);
    else appendLog("Not logged in.");
    setUser(username);
  };
  
  // Handler for direct login via Wialon hosting
  const handleDirectLogin = () => {
    appendLog("Opening Wialon direct login in a new tab...");
    openWialonLogin(token);
  };

  return (
    <div className="bg-white border rounded p-4 shadow max-w-md">
      <h2 className="text-xl font-bold mb-3">Wialon Login</h2>
      <div className="mb-2">
        <input
          type="text"
          className="border px-2 py-1 w-full"
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="Wialon API Token"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded" 
          onClick={onClick}
          disabled={isLoading || !!user}
        >
          Login API
        </button>
        <button 
          className="bg-purple-600 text-white px-3 py-1 rounded" 
          onClick={onClick}
          disabled={isLoading}
        >
          Direct Login
        </button>
        <button 
          className="bg-gray-600 text-white px-3 py-1 rounded" 
          onClick={onClick}
          disabled={isLoading || !user}
        >
          Logout
        </button>
        <button 
          className="bg-green-600 text-white px-3 py-1 rounded" 
          onClick={onClick}
          disabled={isLoading}
        >
          Get User
        </button>
      </div>
      <div className="text-xs text-gray-700 bg-gray-50 border rounded p-2 h-32 overflow-y-auto mb-2">
        {log.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
      <div>
        <strong>Status:</strong>{" "}
        {isLoading ? (
          <span className="text-blue-600">Loading...</span>
        ) : user ? (
          <span className="text-green-700">{user}</span>
        ) : (
          <span className="text-red-600">Not logged in</span>
        )}
      </div>
    </div>
  );
};

export default WialonLoginPanel;