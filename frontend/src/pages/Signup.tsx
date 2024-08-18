import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [userRef, setUserRef] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios
        .post("http://localhost:3000/api/auth/signup", formData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 mx-auto max-w-lg">
      <h1 className="text-3xl text-center">Sign Up</h1>
      <form className="flex flex-col gap-4 my-7" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="enter username"
          className="p-3 border border-blue-700 rounded-md"
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="enter email"
          className="p-3 border border-blue-700 rounded-md"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="enter password"
          className="p-3 border border-blue-700 rounded-md"
          onChange={handleChange}
        />

        <button className="p-2 border border-black rounded-md text-white bg-orange-400 hover:bg-orange-500 font-semibold uppercase">
          {loading ? "signing up..." : "sign up"}
        </button>
      </form>

      <span>
        already have an account?{" "}
        <Link to={"/signin"} className="text-blue-500">
          signin
        </Link>
      </span>
    </div>
  );
};
