import { Comment } from "@/lib/types/comment-app.type";
import { Send } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import TextInput from "../ui/form/TextInput";

const Comments = ({
  comments,
  setCurrComment,
  sendComment,
  curComment,
}: {
  comments: Comment[];
  curComment: string;
  sendComment: () => void;
  setCurrComment: (comment: string) => void;
}) => {
  return (
    <div className="flex flex-col relative overflow-y-scroll justify-between flex-grow mt-2 px-4">
      <div className="" style={{ marginBottom: "calc(5rem)" }}>
        {comments.length === 0 ? (
          <div className="w-full text-center text-xs text-slate-400 mt-10">
            There is no commets so far
          </div>
        ) : null}
        {comments
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
          .map((comment, index) => {
            const separate =
              index === 0 ||
              comment.user.id !== comments[index - 1].user.id ||
              new Date(comment.createdAt).toLocaleString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) !==
                new Date(comments[index - 1].createdAt).toLocaleString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                );
            return (
              <div key={index} className="flex flex-col">
                {separate && (
                  <div className="w-full text-center text-xs text-slate-400 mt-6">
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
                <div
                  className={`flex items-center justify-between mx-2 ${
                    separate ? "mt-4" : ""
                  }`}
                >
                  <div className="flex items-center w-full gap-2">
                    {separate ? (
                      <Tooltip title={comment.user.name}>
                        <div className="rounded-full cursor-pointer w-8 h-8 bg-slate-800 flex items-center justify-center text-white">
                          {comment.user!.name[0]}
                        </div>
                      </Tooltip>
                    ) : (
                      <div className="w-8" />
                    )}
                    <div className="flex flex-col">
                      {separate && (
                        <div className="text-xs text-slate-600">
                          {comment.user!.name}
                        </div>
                      )}
                      <div className="flex bg-slate-200 px-2 py-1 mt-1 flex-col rounded">
                        <div className="text-sm whitespace-normal break-words font-[500] max-w-[300px]">
                          {comment.content}
                        </div>
                        <div className="text-xs text-slate-500">
                          {
                            new Date(comment.createdAt)
                              .toLocaleDateString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })
                              .split(",")[1]
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Comments;
