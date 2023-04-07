import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { RouterOutputs } from "~/utils/api";
import Image from "next/image";

dayjs.extend(relativeTime);

export type PostWithUser = RouterOutputs["post"]["getAll"][number];

export const PostsView = ({ post, author }: PostWithUser) => {
    return (
      <div className="flex gap-3 border-b border-slate-400 p-4">
        <Image
          src={author.profilePicture}
          alt={author.id}
          className="rounded-full"
          width={56}
          height={56}
        />
        <div className="flex flex-col">
          <div className="flex gap-1 font-bold text-slate-300">
            <Link href={`/@${author.username}`}>
              <span>@{author.username}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin">
                {" "}
                {` ${dayjs(post.createdAt).fromNow()}`}
              </span>
            </Link>
          </div>
          <span className="text-2xl">{post.content}</span>
        </div>
      </div>
    );
  };