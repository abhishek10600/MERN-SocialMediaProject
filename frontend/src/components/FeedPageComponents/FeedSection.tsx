import type { FeedPost } from "../../types/feed";

interface FeedSectionProps {
  post: FeedPost;
}

const FeedSection = ({ post }: FeedSectionProps) => {
  return (
    <section className="min-w-[60vw]">
      <h1 className="text-white">{post.owner.username}</h1>
    </section>
  );
};

export default FeedSection;
