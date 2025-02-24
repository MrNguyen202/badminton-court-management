"use client"
import React, { useEffect, useState } from "react";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
};

function page() {

  const [useAuth, setUseAuth] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUseAuth(userData);
    }
  }, []);

  return (
    <div>
      {useAuth?.role == "USER" ? (
          <h1>Bạn không phải admin</h1>
      ) : (
        <h1>Chào {useAuth?.email}</h1>
      )}
    </div>
  );
}

export default page;
