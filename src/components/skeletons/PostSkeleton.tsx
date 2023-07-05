export const PostSkeleton: React.FC = () => {
  return (
    <div className="flex flex-1 animate-pulse flex-col">
      <div className="h-5 w-1/4 rounded-full bg-slate-300" />
      <div className="mt-1 h-8 w-full rounded-full bg-slate-300  pl-4" />
    </div>
  );
};
