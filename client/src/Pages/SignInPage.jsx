import { SignIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "../components/context/ThemeContext";

const SignInPage = () => {
  const { theme } = useTheme();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <SignIn
            path="/sign-in"
            routing="path"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          />
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 hidden lg:block">
          <div className="card-body">
            <img
              src="https://i.pinimg.com/736x/d0/5b/33/d05b33278b79e029a33fe543b03960fa.jpg"
              alt="GoYatra"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
