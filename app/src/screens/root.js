import React from "react";

import { CircularProgress, Grid, Typography } from "@mui/joy";
import { getAuth, signInAnonymously } from "firebase/auth";

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
        <Typography level="title-lg" textAlign={"center"}>
          EtherQuest
        </Typography>

        {currentUser ? (
          "Logged in"
        ) : (
          <Grid xs={12} textAlign={"center"} marginTop={10}>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
