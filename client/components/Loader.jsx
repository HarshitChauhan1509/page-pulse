export default function Loader() {
  return (
    <div className="bg-white rounded-xl shadow-lg mt-8 p-8 text-center">

      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/>

      <h2 className="text-xl font-semibold mt-6">
        Analyzing Website...
      </h2>

      <p className="text-gray-500 mt-2">
        Fetching page, parsing HTML and generating report.
      </p>

    </div>
  );
}