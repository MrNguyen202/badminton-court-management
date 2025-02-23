"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type User = {
  username: string;
  email: string;
};

function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); 
    router.push("/sign-in");
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Chào, {user.username}!</h1>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}

export default ProfilePage;
