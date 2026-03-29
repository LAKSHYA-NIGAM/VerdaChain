import { ethers } from "ethers";

// ──────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Replace this with the address shown in Remix after deploying
// VerdaChain.sol to Sepolia Testnet. See contracts/DEPLOY_INSTRUCTIONS.md
//
// ⚠️  DO NOT use your MetaMask wallet address here — this must be the
//     contract address shown under "Deployed Contracts" in Remix IDE.
// ──────────────────────────────────────────────────────────────────────────────
export const CONTRACT_ADDRESS = "0x045bADFaD298315b87eE3F2c45ea7d85745CccD4";

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "creditId", type: "string" },
      { indexed: false, internalType: "bytes32", name: "resultHash", type: "bytes32" },
      { indexed: false, internalType: "uint8", name: "riskScore", type: "uint8" },
      { indexed: false, internalType: "string", name: "status", type: "string" },
      { indexed: false, internalType: "address", name: "verifier", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "CreditVerified",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_creditId", type: "string" },
      { internalType: "bytes32", name: "_resultHash", type: "bytes32" },
      { internalType: "uint8", name: "_riskScore", type: "uint8" },
      { internalType: "string", name: "_status", type: "string" },
    ],
    name: "logVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allVerifications",
    outputs: [
      { internalType: "string", name: "creditId", type: "string" },
      { internalType: "bytes32", name: "resultHash", type: "bytes32" },
      { internalType: "uint8", name: "riskScore", type: "uint8" },
      { internalType: "string", name: "status", type: "string" },
      { internalType: "address", name: "verifier", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_creditId", type: "string" }],
    name: "getVerifications",
    outputs: [
      {
        components: [
          { internalType: "string", name: "creditId", type: "string" },
          { internalType: "bytes32", name: "resultHash", type: "bytes32" },
          { internalType: "uint8", name: "riskScore", type: "uint8" },
          { internalType: "string", name: "status", type: "string" },
          { internalType: "address", name: "verifier", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct VerdaChain.Verification[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "verifications",
    outputs: [
      { internalType: "string", name: "creditId", type: "string" },
      { internalType: "bytes32", name: "resultHash", type: "bytes32" },
      { internalType: "uint8", name: "riskScore", type: "uint8" },
      { internalType: "string", name: "status", type: "string" },
      { internalType: "address", name: "verifier", type: "address" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // 1. Request accounts
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  // 2. Automatically Switch to Sepolia
  const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError: any) {
    // Error code 4902 indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              rpcUrls: ["https://rpc.sepolia.org"] /* public rpc */,
              nativeCurrency: {
                name: "Sepolia Ether",
                symbol: "SEP",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add Sepolia network to MetaMask");
      }
    } else {
      console.error(switchError);
      throw new Error("Please switch to Sepolia Testnet in MetaMask");
    }
  }

  return accounts[0];
}

export async function storeVerificationOnChain(
  creditId: string,
  resultHash: string,
  riskScore: number,
  status: string
): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(
    window.ethereum as ethers.Eip1193Provider
  );
  
  // Important: adding 500ms delay helps MetaMask settle if network just switched
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // resultHash from the API is "0x" + 64 hex chars = exactly 32 bytes = bytes32.
  // Pass it directly — no need to re-hash. This ensures the SHA-256 fingerprint
  // of the risk analysis lands on-chain as-is.
  //
  // Note: hardcoding gasLimit prevents MetaMask from getting stuck on `eth_estimateGas`
  // if network conditions are poor or wrong RPC is selected, which often causes silent hangs.
  const tx = await contract.logVerification(
    creditId,
    resultHash,
    riskScore,
    status,
    { gasLimit: 300000 }
  );
  
  const receipt = await tx.wait();
  return receipt.hash;
}

export function getEtherscanUrl(txHash: string): string {
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}
