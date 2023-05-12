import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/initSupabase";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      await supabase.auth.getSession().then((data) => {
        const session = data ? data.session : null;
        setSession(session);
        setUser(session ? true : false);
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session ? session.user : false);
      });
    };
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
