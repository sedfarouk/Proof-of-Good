import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { ToastProvider } from "~~/providers/ToastProvider";
import { LoadingProvider } from "~~/providers/LoadingProvider";
import { NavigationLoader } from "~~/components/shared/NavigationLoader";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "ProofOfGood - Community Impact Platform",
  description: "Transform your positive actions into verifiable impact. Join thousands creating meaningful change through community challenges.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>
            <LoadingProvider>
              <ToastProvider>
                <NavigationLoader />
                {children}
              </ToastProvider>
            </LoadingProvider>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
