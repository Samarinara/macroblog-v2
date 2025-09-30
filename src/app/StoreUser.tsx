"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export default function StoreUser() {
  const store = useMutation(api.users.store);

  useEffect(() => {
    void store({});
  }, [store]);
  return null;
}