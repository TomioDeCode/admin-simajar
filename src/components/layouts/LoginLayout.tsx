import { memo } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";

const LoginLayout = memo(function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm />
      </div>
    </div>
  );
});

export default LoginLayout;
