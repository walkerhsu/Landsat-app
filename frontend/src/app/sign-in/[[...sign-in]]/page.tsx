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
      <SignIn />
    </div>
  );
};

export default SignInPage;
