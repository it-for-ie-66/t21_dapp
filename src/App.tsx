import { secretABI, tokenABI, NFTABI } from "./abi";
import {
  MY_ACCOUNT_ADDRESS,
  SECRET_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_SYMBOL,
  NFT_CONTRACT_ADDRESS,
} from "./env";
import { formatUnits } from "viem";
import { useContractRead, useBalance } from "wagmi";
import { useState } from "react";

const urlMyAccount = `https://sepolia.etherscan.io/address/${MY_ACCOUNT_ADDRESS}`;
const urlSecret = `https://sepolia.etherscan.io/address/${SECRET_CONTRACT_ADDRESS}`;
const urlToken = `https://sepolia.etherscan.io/address/${TOKEN_CONTRACT_ADDRESS}`;
const urlNFT = `https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`;

function App() {
  const [NFTimage, setNFTImage] = useState<string>("");

  const useBal = useBalance({
    address: MY_ACCOUNT_ADDRESS,
  });

  const useReadSecret = useContractRead({
    address: SECRET_CONTRACT_ADDRESS,
    abi: secretABI,
    functionName: "secret",
  });

  const useReadTokenBalance = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [MY_ACCOUNT_ADDRESS],
  });

  const userReadNFT = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFTABI,
    functionName: "tokenURI",
    args: [0n],
    select: (uri) => {
      fetch(uri)
        .then((res) => res.json())
        .then((data) => {
          setNFTImage(data.image);
        });
    },
  });

  const displayBalance = useBal.isLoading
    ? "...loading"
    : `${parseFloat(useBal.data?.formatted || "0").toFixed(2)} (SepoliaETH)`;
  const displaySecret = useReadSecret.isLoading
    ? "...loading"
    : useReadSecret.data || "";
  const displayToken = useReadTokenBalance.isLoading
    ? "...loading"
    : `${parseFloat(formatUnits(useReadTokenBalance.data || 0n, 18)).toFixed(
        2
      )} ${TOKEN_SYMBOL}`;

  return (
    <>
      <h1>My Blockchain Assets</h1>

      <div>
        <h2>My account balance</h2>
        <div>{displayBalance}</div>
        <a href={urlMyAccount} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My secret</h2>
        <div>{displaySecret}</div>
        <a href={urlSecret} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My Token</h2>
        <div>{displayToken}</div>
        <a href={urlToken} target="_blank">
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My NFT</h2>
        <div>
          {userReadNFT.isLoading || !NFTimage ? (
            "...loading"
          ) : (
            <img src={NFTimage} style={{ maxHeight: "30vh" }} />
          )}
        </div>
        <a href={urlNFT} target="_blank">
          Link
        </a>
      </div>
    </>
  );
}

export default App;
