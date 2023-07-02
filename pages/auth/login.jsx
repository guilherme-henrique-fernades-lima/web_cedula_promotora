import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import styles from "@/styles/Home.module.css";

export default function Login() {
  const [userName, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const { data: session, status } = useSession();

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName,
      password: pass,
      redirect: false,
      callbackUrl: "/",
    });
  };

  return (
    <>
      <div className={styles.body}>
        {session?.user ? (
          <div className={styles.loggedIn}>
            <span>USUÁRIO LOGADO</span>
          </div>
        ) : (
          <div className={styles.notLoggedIn}>
            <span>USUÁRIO NÃO LOGADO</span>
          </div>
        )}
        {/* 
        {status === "unauthenticated" ? (
          <div className={styles.form}>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="password"
              onChange={(e) => {
                setPass(e.target.value);
              }}
            />
            <button onClick={onSubmit}>LOGIN</button>
          </div>
        ) : (
          <></>
        )} */}

        <button
          onClick={() => signIn("google")}
          className={styles.googleButton}
        >
          LOGIN GOOGLE
        </button>

        {/* <button onClick={() => {}} className={styles.facebookButton}>
          LOGIN FACEBOOK
        </button> */}

        {session?.user && (
          <a onClick={() => signOut()} className={styles.logoutButton}>
            LOGOUT
          </a>
        )}
      </div>
    </>
  );
}
