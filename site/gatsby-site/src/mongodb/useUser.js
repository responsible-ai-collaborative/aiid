import { useEffect, useState } from 'react';
import { getUser } from './authenticate';

export const useUser = () => {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('anonymous');

  const [user, setUser] = useState();

  useEffect(() => {
    getUser().then(({ user, type}) => {
      setUser(user);
      setType(type);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    user,
    isAdmin: !loading && type === 'token',
  };
};
