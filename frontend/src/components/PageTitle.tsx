interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <h1 className="text-4xl font-bold text-left text-brand-black mb-2 p-4">
      {title}
    </h1>
  );
};
