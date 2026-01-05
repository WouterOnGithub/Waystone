import { useCallback, useEffect, useState } from "react";
import { getAccount, updateAccount } from "../api/AccountData";

export function useAccount() {
  const [data, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (updating) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAccount();
      setAccountData(res);
    } catch (err) {
      setError(err?.message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  },[updating]);

  useEffect(() => { load(); }, [load]);

  const update = useCallback(async (payload) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await updateAccount(payload);
      setAccountData(res);
      return res;
    } catch (err) {
      setError(err?.message || "Failed to update account");
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  return { data, loading, updating, error, load, update, setAccountData };
}