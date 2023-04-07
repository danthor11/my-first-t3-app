import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import {  api } from "~/utils/api";

import Image from "next/image";
import { LoadingPage, LoadingSpinner } from '~/components/loading';
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Layout } from "~/components/Layout";
import { PostWithUser, PostsView } from "~/components/PostView";



const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: posting } = api.post.create.useMutation({
    onSuccess: async () => {
      setInput("");
      await ctx.post.getAll.invalidate();
    },
    onError({data}) {
      const errorMessage = data?.zodError?.fieldErrors.content;
      
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      }else{
        toast.error("Failed to post, please try later!")
      }
    },
  });

  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile name"
        className="rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type sound emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === "Enter"){
            e.preventDefault()
            mutate({ content: input });
          }
        }}  
        disabled={posting}
      />

      {input !== "" && !posting && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
        >
          Post
        </button>
      )}

      {posting && <div className="flex justify-center items-center">
          <LoadingSpinner size={18}/>
        </div>}
    </div>
  );
};





const Feed = () => {
  const { data, isLoading: postLoading } = api.post.getAll.useQuery();

  if (postLoading) return <LoadingPage />;

  if (!data)
    return <div className="text-2xl text-red-700">Something gone wrong</div>;

  return (
    <div>
      {data.map(({ post, author } : PostWithUser) => (
        <PostsView key={post.id} post={post} author={author} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>My first T3 app 💥</title>
        <meta name="description" content="this is my t3 app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>

          <div className="flex border-b border-slate-400 p-4 ">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton mode="modal">
                  <button className="btn">Sign in</button>
                </SignInButton>
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
      
          <Feed />
      </Layout>
     
    </>
  );
};

export default Home;
