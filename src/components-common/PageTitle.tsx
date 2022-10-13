type PageTitleProps = {
  title: string;
  actions: React.ReactNode | React.ReactNode[];
};
export const PageTitle = (props: PageTitleProps) => {
  const { title, actions } = props;
  return (
    <div className="mb-4 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      {actions && <div className="mt-3 sm:mt-0 sm:ml-4">{actions}</div>}
    </div>
  );
};
