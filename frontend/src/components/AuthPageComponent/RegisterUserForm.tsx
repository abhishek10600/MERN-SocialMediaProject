import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "../../schemas/auth.schema";
import type { RegisterUserFormData } from "../../schemas/auth.schema";
import { useState } from "react";
import { registerUser } from "../../api/auth.api";
import Spinner from "../General/Spinner";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";

const RegisterUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    console.log(data);
    try {
      setLoading(true);
      setServerError(null);

      const response = await registerUser(data);
      // console.log("Registered: ", response);
      dispatch(setUser(response.data.user));
      toast.success("Account Created Successfully");
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
      className="flex flex-col gap-2 text-sm"
    >
      {/* Username */}
      <div>
        <label className="block text-gray-300 mb-1 font-medium">Username</label>

        <input
          type="text"
          {...register("username")}
          placeholder="Create your username"
          className={`${inputBase} ${inputFocus} ${
            errors.username ? inputError : "border-[#2a2a35]"
          }`}
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.username?.message}
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-300 mb-1 font-medium">Email</label>

        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className={`${inputBase} ${inputFocus} ${
            errors.email ? inputError : "border-[#2a2a35]"
          }`}
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.email?.message}
        </p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-gray-300 mb-1 font-medium">Password</label>

        <input
          type="password"
          {...register("password")}
          placeholder="Create your password"
          className={`${inputBase} ${inputFocus} ${
            errors.password ? inputError : "border-[#2a2a35]"
          }`}
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.password?.message}
        </p>
      </div>

      {/* Profile Image */}
      <div>
        <label className="block text-gray-300 mb-1 font-medium">
          Profile Picture
        </label>

        <input
          type="file"
          {...register("profileImage")}
          accept="image/*"
          className="
            w-full text-sm text-gray-300
            border border-[#2a2a35]
            rounded-xl bg-[#15151c]
            file:mr-4 file:px-4 file:py-2
            file:rounded-lg file:border-0
            file:bg-[#9929EA]
            file:text-white
            file:cursor-pointer
            hover:file:bg-[#7b14c4]
            cursor-pointer
          "
        />

        <p className="text-red-500 text-xs mt-1 min-h-[16px]">
          {errors.profileImage?.message}
        </p>
      </div>

      {/* Login link */}
      <Link
        to="/login"
        className="text-xs text-[#b46cff] hover:underline text-center"
      >
        Already have an account?
      </Link>

      {/* Submit */}
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
        {loading ? <Spinner /> : "Create Account"}
      </button>
    </form>
  );
};
export default RegisterUserForm;
