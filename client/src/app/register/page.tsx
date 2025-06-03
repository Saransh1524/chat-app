"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("username", res.data.user.username);
        router.push("/chat");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("username already exists");
      alert("Registration failed. Username may already exist.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
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
        onClick={handleRegister}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Register
      </button>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
