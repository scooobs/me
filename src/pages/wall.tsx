import { type NextPage } from "next";
import Head from "next/head";
import { Wall } from "~/components/Wall";

const WallPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>wall</title>
        <meta
          name="description"
          content="you're looking here, better say hello :)"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full min-w-full flex-row">
        <div className="flex-1" />
        <div
          className="flex flex-[2] flex-col gap-4 break-words"
          style={{ inlineSize: "50%" }}
        >
          <div className="h-16" />
          <Wall />
          <div className="h-16" />
        </div>
        <div className="flex-1" />
      </main>
    </>
  );
};

export default WallPage;
