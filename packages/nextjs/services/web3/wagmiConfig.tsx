import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, fallback, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig, { DEFAULT_ALCHEMY_API_KEY, ScaffoldConfig } from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors(),
  ssr: true,
  client({ chain }) {
    let rpcFallbacks = [http()];

    const rpcOverrideUrl = (scaffoldConfig.rpcOverrides as ScaffoldConfig["rpcOverrides"])?.[chain.id];
    if (rpcOverrideUrl) {
      // Use override URL as primary, with default fallback
      rpcFallbacks = [http(rpcOverrideUrl), http()];
    } else {
      // For chains without override, use public endpoints to avoid CORS
      if (chain.id === 1) {
        // Mainnet - use public RPC to avoid CORS
        rpcFallbacks = [http("https://ethereum-rpc.publicnode.com"), http()];
      } else if (chain.id === 84532) {
        // Base Sepolia
        rpcFallbacks = [http("https://sepolia.base.org"), http()];
      } else if (chain.id === 84532) {
        // Base Sepolia - use official endpoint
        rpcFallbacks = [http("https://sepolia.base.org"), http()];
      } else {
        // For other chains, try Alchemy if available, but prioritize default
        const alchemyHttpUrl = getAlchemyHttpUrl(chain.id);
        if (alchemyHttpUrl && scaffoldConfig.alchemyApiKey !== "demo") {
          rpcFallbacks = [http(alchemyHttpUrl), http()];
        } else {
          rpcFallbacks = [http()];
        }
      }
    }

    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
