import { useSDK } from "@metamask/sdk-react";
import { Typography } from "@mui/joy";
import React from "react";
import SceneScreen from "./scene";
import { EtherspotTransactionKit } from "@etherspot/transaction-kit";
import { useLazyGetStoryStartQuery } from "../../services/story";

export default function StoryScreen() {
  const { sdk, connected, provider } = useSDK();
  const [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    const connect = async () => {
      try {
        const accounts = await sdk?.connect();
        console.log("accounts", accounts);
        setAccount(accounts?.[0]);
      } catch (err) {
        console.warn(`failed to connect..`, err);
      }
    };

    connect();
  }, [sdk]);

  return connected ? (
    <EtherspotTransactionKit provider={provider}>
      <SceneScreen provider={provider} />
    </EtherspotTransactionKit>
  ) : (
    <Typography>Connecting to MM...</Typography>
  );
}
