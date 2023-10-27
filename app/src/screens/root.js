import React from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";

import { CircularProgress, Grid, Typography } from "@mui/joy";
import { getAuth, signInAnonymously } from "firebase/auth";
import StoryScreen from "./story/story";

export default function RootContainer() {
  const auth = getAuth();

  const [currentUser, setCurrentUser] = React.useState(false);

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        signInAnonymously(auth);
      }
    });
  }, [auth, currentUser]);

  return (
    <Grid container>
      <Grid xs={12}>
        <Typography level="title-lg" textAlign={"center"} marginBottom={10}>
          EtherQuest
        </Typography>

        {currentUser ? (
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              checkInstallationImmediately: false,
              dappMetadata: {
                name: "Demo React App",
                url: window.location.host,
              },
            }}
          >
            <StoryScreen />
          </MetaMaskProvider>
        ) : (
          <Grid xs={12} textAlign={"center"} marginTop={10}>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
