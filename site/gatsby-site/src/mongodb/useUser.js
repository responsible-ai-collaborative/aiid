import { useEffect, useState } from 'react';
import { getUser } from './authenticate';

export const useUser = () => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState();

  useEffect(() => {
    getUser().then((res) => {
      setUser(res.user);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    user,
  };
};
