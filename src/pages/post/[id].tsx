import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { prisma } from "../../server/db";
import { appRouter } from "~/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

const SinglePostView: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post view</title>
      </Head>
      <main className="flex h-screen justify-center ">
        <div>Post View</div>
      </main>
    </>
  );
};



export default SinglePostView;
