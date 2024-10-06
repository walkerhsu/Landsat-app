import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <SignUp forceRedirectUrl="/loading" />
    </div>
  );
};

export default SignUpPage;
