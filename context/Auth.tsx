import { router, useSegments } from "expo-router";
import React from "react";

export const AuthContext = React.createContext<any>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user: any) {
  const segments = useSegments();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(root)";
    if ( user && !inAuthGroup ) {
      router.replace("/(root)/main");
    } else if (!user && inAuthGroup) {
      router.replace("/");
    }

  }, [user, segments]);
}

export function Provider(props: any) {
  const [user, setAuth] = React.useState<any>(null);

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => setAuth({}),
        signOut: () => setAuth(null),
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}