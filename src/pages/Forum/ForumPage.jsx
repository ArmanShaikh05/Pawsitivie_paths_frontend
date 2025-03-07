import CreatePostHeader from "./CreatePostHeader";
import ForumBlogs from "./ForumBlogs";
import ForumMessages from "./ForumMessages";

const ForumPage = () => {
  return (
    <div className="page-container hidden-scrollbar p-6 grid grid-cols-[auto_480px] gap-10 ">
      <ForumBlogs />
      <div className="page-container hidden-scrollbar">
        <CreatePostHeader />
        <ForumMessages />
      </div>
    </div>
  );
};

export default ForumPage;
