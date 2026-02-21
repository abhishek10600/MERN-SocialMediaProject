import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../schemas/auth.schema";
import type { LoginUserFormData } from "../../schemas/auth.schema";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth.api";
import Spinner from "../General/Spinner";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

const LoginUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    // console.log(data);
    try {
      setLoading(true);
      setServerError(null);

      const response = await loginUser(data);
      dispatch(setUser(response.data.user));
      toast.success(`Welcome Back ${response.data.user.username}`);
      reset();
      navigate("/");
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full bg-[#15151c] border text-gray-100 px-2 py-2 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-500";

  const inputFocus =
    "focus:border-[#9929EA] focus:ring-2 focus:ring-[#9929EA]/30";

  const inputError = "border-red-500 focus:ring-red-500/20";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 text-sm"
    >
      <div className="flex flex-col gap-2">
        <label className="text-[#9929EA]">Username or Email</label>
        {/* <input
          type="text"
          {...register("identifier")}
          placeholder="enter your username or email"
          className="text-white p-2 border rounded-xl"
        />
        {errors.identifier && (
          <p className="text-red-400 text-xs h-4">
            {errors.identifier.message}
          </p>
        )} */}

        <input
          type="text"
          {...register("identifier")}
          placeholder="Create your username"
          className={`${inputBase} ${inputFocus} ${
            errors.identifier ? inputError : "border-[#2a2a35]"
          }`}
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.identifier?.message}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {/* <label className="text-[#9929EA]">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="enter your password"
          className="text-white p-2 border rounded-xl"
        />
        {errors.password && (
          <p className="text-red-400 text-xs h-4">{errors.password.message}</p>
        )} */}

        <input
          type="text"
          {...register("password")}
          placeholder="Enter your username"
          className={`${inputBase} ${inputFocus} ${
            errors.password ? inputError : "border-[#2a2a35]"
          }`}
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.password?.message}
        </p>
      </div>
      <Link to="/register" className="text-[#9929EA]">
        Don't have an account?
      </Link>
      <button
        type="submit"
        disabled={loading}
        className="
          w-full bg-[#9929EA]
          hover:bg-[#7b14c4]
          text-white font-semibold
          py-3 rounded-xl
          transition-all duration-200
          active:scale-[0.98]
          disabled:opacity-60
          disabled:cursor-not-allowed
          flex items-center justify-center
          cursor-pointer
        "
      >
        {loading ? <Spinner /> : "Login"}
      </button>
    </form>
  );
};

export default LoginUserForm;
