import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Layout } from "~/components/Layout";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import { PostWithUser, PostsView } from "../components/PostView";
import { generateSSGHelper } from "~/server/helpers/generateSSGHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div>
      {data.map(({author,post}:PostWithUser) => (
        <PostsView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div />;
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Layout>
        <div className="relative h-36  bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={data.username || "profile-photo"}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-2 border-black"
          />
        </div>
        <div className="h-[64px]"/>

        <div className="p-4 text-2xl font-bold">
          {`@${data.username ?? ""}`}
        </div>

        <div className="w-full border-b border-slate-400"/>
          <ProfileFeed userId={data.id}/>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no Slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trcpState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
