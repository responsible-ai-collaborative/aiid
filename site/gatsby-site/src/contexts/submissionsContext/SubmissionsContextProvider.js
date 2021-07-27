import React, { useEffect, useMemo, useState } from 'react';
import { ObjectId } from 'bson';

import { useMongo } from 'hooks/useMongo';
import { SubmissionsContext } from './SubmissionsContext';
import { useUserContext } from 'contexts/userContext';

export const SubmissionsContextProvider = ({ children }) => {
  const { loading: authLoading } = useUserContext();

  const [loading, setLoading] = useState(false);

  const [submissions, setSubmissions] = useState([]);

  const { runQuery } = useMongo();

  const refetch = () => {
    setLoading(true);

    runQuery(null, (res) => {
      setSubmissions(res.map((doc) => ({ ...doc, mongodb_id: new ObjectId(doc._id).toString() })));
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!authLoading) {
      refetch();
    }
  }, [authLoading]);

  return (
    <SubmissionsContext.Provider
      value={useMemo(
        () => ({
          loading,
          submissions,
          actions: {
            refetch,
          },
        }),
        [loading, submissions, refetch]
      )}
    >
      {children}
    </SubmissionsContext.Provider>
  );
};
