import type { AppProps } from "next/app";
import GlobalStyles from "@/components/GlobalStyles";
import { WeatherProvider } from "@/context/WeatherContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WeatherProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </WeatherProvider>
  );
}
