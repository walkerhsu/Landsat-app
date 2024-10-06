import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <SignIn forceRedirectUrl="/loading"/>
    </div>
  );
};

export default SignInPage;
