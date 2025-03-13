import CreatePostHeader from "./CreatePostHeader";
import ForumBlogs from "./ForumBlogs";
import ForumMessages from "./ForumMessages";

const ForumPage = () => {
  return (
    <div className="page-container hidden-scrollbar p-6 grid grid-cols-[1.5fr_1fr] max-[900px]:grid-cols-1 max-[900px]:p-0 gap-2 ">
      <ForumBlogs />
      <div className="page-container hidden-scrollbar max-[900px]:hidden">
        <div className="w-full hidden lg:block">
          <CreatePostHeader />
        </div>
        <ForumMessages />
      </div>
    </div>
  );
};

export default ForumPage;
