import { EtherspotTransactionKit } from "@etherspot/transaction-kit";
import { useSDK } from "@metamask/sdk-react";
import { Typography } from "@mui/joy";
import React from "react";
import SceneScreen from "./scene";

export default function StoryScreen() {
  const { provider, sdk, connected } = useSDK();
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
    <SceneScreen provider={provider} />
  ) : (
    <Typography>Connecting to MM...</Typography>
  );
}
