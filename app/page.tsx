import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import SuperfluidWidget, {
  EventListeners,
  supportedNetworks,
  WalletManager,
} from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { useState, useMemo } from "react";
import { configureChains, createConfig, WagmiConfig, useNetwork } from "wagmi";

import paymentDetails from "../components/paymentDetails";
import productDetails from "../components/productDetails";
import { apolloClient, query } from "../components/lens";

const projectId = "952483bf7a0f5ace4c40eb53967f1368";

const { publicClient } = configureChains(supportedNetworks, [
  w3mProvider({ projectId }),
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains: supportedNetworks,
  }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, supportedNetworks);

export default function Home() {
  const { open, isOpen } = useWeb3Modal();
  const walletManager = useMemo<WalletManager>(
    () => ({
      open,
      isOpen,
    }),
    [open, isOpen],
  );

  const [recipient, setRecipient] = useState("");
  const [recipientIsValid, setRecipientIsValid] = useState("");

  const handleRecipientChange = (e) => {
    console.log("Set recipient: " + recipient);
    setRecipient(e.target.value);
  }

  const handleRecipientCheck = async () => {
    console.log("Checking recipient...");
    checkRecipient();
  }

  const checkRecipient = async () => {
    const response = await apolloClient.query({
      query: query,
      variables: {
        address: recipient
      }
    });
    setRecipientIsValid(response.data.defaultProfile == null ? "false" : "true");
    console.log("Recipient is valid: " + recipientIsValid);
    console.log(response);
  }

  return (
    <main className="bg-white min-h-screen flex-col items-center justify-between p-24">
      <section className="w-full m-4 flex items-center justify-between">
        <input
          className="w-2/3 h-12 rounded mr-4 p-2 border-2 border-gray-300 hover:border-gray-500 focus:border-gray-700"
          type="text"
          id="recipientInput"
          name="recipientInput"
          placeholder="Enter the recipient address"
          onChange={handleRecipientChange}
        />
        <button
          className="bg-[#1aa023] font-semibold w-1/3 h-12 ml-4 rounded-3xl text-white"
          onClick={handleRecipientCheck}
        >
          Check Recipient
        </button>
      </section>
      <section className="w-full m-4">
        {recipientIsValid == "true" ?
          <>
            <WagmiConfig config={wagmiConfig}>
              <SuperfluidWidget
                productDetails={productDetails}
                paymentDetails={paymentDetails}
                tokenList={superTokenList}
                type="dialog"
                walletManager={walletManager}
              >
                {({ openModal }) => (
                  <button
                    className="bg-[#1aa023] w-full font-semibold h-12 self-auto rounded-3xl text-white"
                    onClick={() => openModal()}
                  >Create Stream</button>
                )}
              </SuperfluidWidget>
            </WagmiConfig>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </>
          : recipientIsValid == "false" ?
            <h3 className="self-auto">
              {recipient} is not a valid recipient address (no Lens handle).
            </h3>
            :
            <h3 className="self-auto">
              Click "Check Recipient" to confirm {recipient} address is valid (i.e. it has a Lens handle).
            </h3>
        }
      </section>
    </main>
  )
}