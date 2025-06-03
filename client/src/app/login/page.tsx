"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://chat-app-backend-on00.onrender.com/api/login", {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("token", res.data.token);
        router.push("/chat");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-2 rounded"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-500 underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
