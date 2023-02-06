import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const mintButton = document.getElementById("mintButton");

connectButton.onclick = connect;
mintButton.onclick = mint;

let walletAddress;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      ethereum.on("accountsChanged", function (accounts) {
        setWalletAddress(accounts[0]);
      });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    setWalletAddress(accounts[0]);
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function getWalletBalance() {
  if (walletAddress) {
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [walletAddress, "latest"],
    });
    const balanceInEther = parseInt(balance, 16) / 1e18;
    document.getElementById("walletBalance").innerHTML =
      balanceInEther + " ETH";
  } else {
    document.getElementById("walletBalance").innerHTML = "Not connected";
  }
}

function setWalletAddress(newAddress) {
  walletAddress = newAddress;
  document.getElementById("walletAddress").innerHTML = walletAddress;
  getWalletBalance();
}

async function mint() {
  if (walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    contract.safeMint(walletAddress);
  } else {
    console.log("Please connect to your wallet.");
  }
}
