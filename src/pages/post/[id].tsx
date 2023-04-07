import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { prisma } from "../../server/db";
import { appRouter } from "~/server/api/root";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";
import { Layout } from "~/components/Layout";
import { api } from "~/utils/api";
import { PostsView } from "~/components/PostView";

const SinglePostView: NextPage<{ postId: string }> = ({ postId }) => {
  const { data, isLoading } = api.post.getByID.useQuery({
    postId
  });

  if (!data) return <div />;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <Layout>
        
        <PostsView post={data.post} author={data.author} />
    
      </Layout>
    </>
  );
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no Slug");


  await ssg.post.getByID.prefetch({ postId:id });

  return {
    props: {
      trcpState: ssg.dehydrate(),
      postId:id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};



export default SinglePostView;
