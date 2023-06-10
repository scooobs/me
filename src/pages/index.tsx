import { type NextPage } from "next";
import Head from "next/head";
import { Profile } from "~/components/Profile";
import { Section } from "~/components/Section";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>➐➐➐</title>
        <meta
          name="description"
          content="you're looking here, better say hello :)"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full min-w-full flex-row">
        <div className="flex-1" />
        <div className="flex flex-[2] flex-col gap-4">
          <div className="h-16" />
          <Profile />
          <Section sectionName="Employment" />
          <Section sectionName="Education" />
          <div className="h-16" />
        </div>
        <div className="flex-1" />
      </main>
    </>
  );
};

export default Home;
