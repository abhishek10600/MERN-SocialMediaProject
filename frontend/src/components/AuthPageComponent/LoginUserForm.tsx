import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "../../schemas/auth.schema";
import type { LoginUserFormData } from "../../schemas/auth.schema";

const LoginUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = (data: LoginUserFormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border flex flex-col md:gap-3 md:text-sm"
    >
      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Username or Email</label>
        <input
          type="text"
          {...register("identifier")}
          placeholder="enter your username or email"
          className="text-white md:p-2 border rounded-xl"
        />
        {errors.identifier && (
          <p className="text-red-400 text-xs h-4">
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div className="flex flex-col md:gap-2">
        <label className="text-[#9929EA]">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="enter your password"
          className="text-white md:p-2 border rounded-xl"
        />
        {errors.password && (
          <p className="text-red-400 text-xs h-4">{errors.password.message}</p>
        )}
      </div>
      <Link to="/register" className="text-[#9929EA]">
        Don't have an account?
      </Link>
      <button
        type="submit"
        className="bg-[#9929EA] md:py-2 rounded-xl font-bold hover:bg-[#7b14c4] cursor-pointer ease-in-out duration-200"
      >
        Login
      </button>
    </form>
  );
};

export default LoginUserForm;
