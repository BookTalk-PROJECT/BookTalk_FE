interface BreadCrumbProps {
  major: string;
  sub: string;
}

const BreadCrumb = ({ major, sub }: BreadCrumbProps) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="text-lg font-medium text-gray-700">
        {major} &gt; {sub}
      </div>
    </div>
  );
};

export default BreadCrumb;
