import { EtherspotTransactionKit } from "@etherspot/transaction-kit";
import { Typography } from "@mui/joy";

export default function SceneScreen(props) {
  console.log("provider", props.provider);

  return (
    <EtherspotTransactionKit provider={props.provider}>
      <Typography>Hello TK</Typography>
    </EtherspotTransactionKit>
  );
}
