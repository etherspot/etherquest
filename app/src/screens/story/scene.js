import React from "react";

import { useWalletAddress } from "@etherspot/transaction-kit";
import { AspectRatio, Button, Grid, Typography } from "@mui/joy";
import { useLazyGetStoryQuery } from "../../services/story";

export default function SceneScreen(props) {
  const userAddress = useWalletAddress("etherspot-prime");
  const [storyTrigger, storyResult] = useLazyGetStoryQuery();

  React.useEffect(() => {
    storyTrigger();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Typography level="title-lg" textAlign={"center"}>
          {storyResult.data?.title}
        </Typography>
      </Grid>

      <Grid xs={12}>
        <Typography level="title-md" textAlign={"center"}>
          {storyResult.data?.passage}
        </Typography>
      </Grid>

      <Grid xs={12}>
        <AspectRatio objectFit="contain">
          <img
            src={storyResult.data?.image}
            srcSet={storyResult.data?.images}
            alt={storyResult.data?.title}
          />
        </AspectRatio>
      </Grid>

      <Grid xs={6}>
        {storyResult.data?.negativeIntentPageId ? (
          <Button
            onClick={() => storyTrigger(storyResult.data?.negativeIntentPageId)}
            fullWidth
          >
            {storyResult.data?.negativeIntentText}
          </Button>
        ) : null}
      </Grid>

      <Grid xs={6}>
        {storyResult.data?.positiveIntentPageId ? (
          <Button
            onClick={() => storyTrigger(storyResult.data?.positiveIntentPageId)}
            fullWidth
          >
            {storyResult.data?.positiveIntentText}
          </Button>
        ) : null}
      </Grid>

      <Grid xs={12}>
        <code>{JSON.stringify(storyResult)}</code>
      </Grid>
    </Grid>
  );
}
