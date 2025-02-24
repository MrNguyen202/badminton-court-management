"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";

type User = {
  username: string;
  email: string;
};

function ProfilePage() {
  const router = useRouter();

  const [useAuth, setUseAuth] = useState<any>(null);

  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUseAuth(JSON.parse(userData));
      }
    };

    loadUser(); // Load khi component mount

    // Lắng nghe khi localStorage thay đổi (do đăng nhập)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  console.log("profile", useAuth);

  const handleLogout = () => {
    localStorage.removeItem("user");
    
    window.location.reload();

    router.push("/");
  };

  return (
    <div>
      {useAuth ? (
        <div>
          <h1>Chào, {useAuth.username}!</h1>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Bạn chưa đăng nhập.</p>
      )}
    </div>
  );
}

export default ProfilePage;
