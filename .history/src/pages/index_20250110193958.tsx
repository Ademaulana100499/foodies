import Head from "next/head";
import Navbar from "@/components/Navbar";
import MainPage from "./Main";
import Footer from "@/components/Footer";
import { getCookie } from "cookies-next"; // Sesuaikan path jika perlu

export async function getServerSideProps(context) {
  const token = getCookie("token", context.req);

  return {
    props: {
      token: token || null,
    },
  };
}

export default function Home({ token }) {
  return (
    <div>
      <Head>
        <title>Foodies</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar token={token} />
        <MainPage />
        <Footer />
      </div>
    </div>
  );
}
