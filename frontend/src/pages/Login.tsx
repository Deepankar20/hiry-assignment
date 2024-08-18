import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    if (e.target.name && e.target.value) {
      //@ts-ignore
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios
        .post("http://localhost:3000/api/auth/signin", formData)
        .then((res) => {
          console.log(res);
          localStorage.setItem("token", JSON.stringify(res.data.token));
        })
        .catch((error) => {
          console.log(error);
        });

      setFormData({ email: "", password: "" });
    } catch (error) {
      console.log(error);
    }

    navigate("/");
    setLoading(false);
  };

  return (
    <div className="p-5 mx-auto max-w-lg">
      <h1 className="text-3xl text-center">Log In</h1>
      <form className="flex flex-col gap-4 my-7" onSubmit={handleFormSubmit}>
        <input
          type="email"
          name="email"
          value={formData?.email}
          placeholder="enter email"
          className="p-3 border border-blue-700 rounded-md"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={formData?.password}
          placeholder="enter password"
          className="p-3 border border-blue-700 rounded-md"
          onChange={handleChange}
        />

        <button className="p-2 border border-black rounded-md text-white bg-orange-400 hover:bg-orange-500 font-semibold uppercase">
          {loading ? "logging in..." : "log in"}
        </button>
      </form>

      <span>
        dont have an account?{" "}
        <Link to={"/signup"} className="text-blue-500">
          signup here
        </Link>
      </span>
    </div>
  );
};
