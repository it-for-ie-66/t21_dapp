import { secretABI, tokenABI, NFTABI } from "./abi";
import {
  MY_ACCOUNT_ADDRESS,
  SECRET_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from "./env";
import { formatUnits } from "viem";
import { useContractRead, useBalance } from "wagmi";
import { useState } from "react";

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

  return (
    <>
      <h1>My Blockchain Assets</h1>

      <div>
        <h2>My account balance</h2>
        <div>
          {useBal.isLoading
            ? "...loading"
            : `${parseFloat(useBal.data?.formatted || "0").toFixed(
                2
              )} (SepoliaETH)`}
        </div>
        <a
          href={`https://sepolia.etherscan.io/address/${MY_ACCOUNT_ADDRESS}`}
          target="_blank"
        >
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My secret</h2>
        <div>
          {useReadSecret.isLoading ? "...loading" : useReadSecret.data || ""}
        </div>
        <a
          href={`https://sepolia.etherscan.io/address/${SECRET_CONTRACT_ADDRESS}`}
          target="_blank"
        >
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My Token</h2>
        <div>
          {useReadTokenBalance.isLoading
            ? "...loading"
            : `${parseFloat(
                formatUnits(useReadTokenBalance.data || 0n, 18)
              ).toFixed(2)} POH`}
        </div>
        <a
          href={`https://sepolia.etherscan.io/address/${TOKEN_CONTRACT_ADDRESS}`}
          target="_blank"
        >
          Link
        </a>
        <hr />
      </div>

      <div>
        <h2>My NFT</h2>
        <div>
          {userReadNFT.isLoading ? (
            "...loading"
          ) : (
            <img src={NFTimage} style={{ maxHeight: "30vh" }} />
          )}
        </div>

        <a
          href={`https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`}
          target="_blank"
        >
          Link
        </a>
      </div>
    </>
  );
}

export default App;
