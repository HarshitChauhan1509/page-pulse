function formatBytes(bytes) {
  if (!bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];

  let index = 0;
  let size = bytes;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

export default function AuditCard({ result }) {
  const audit = result.data;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold">
          Audit Report
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-white font-semibold ${
            result.cached
              ? "bg-green-600"
              : "bg-blue-600"
          }`}
        >
          {result.cached ? "Cached" : "Fresh"}
        </span>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card
          title="Website"
          value={audit.url}
        />

        <Card
          title="Status"
          value={audit.status}
        />

        <Card
          title="Response Time"
          value={`${audit.responseTime} ms`}
        />

        <Card
          title="Page Size"
          value={formatBytes(audit.pageSize)}
        />

        <Card
          title="Images"
          value={audit.images}
        />

        <Card
          title="Links"
          value={audit.links}
        />

      </div>

      <div className="mt-8">

        <Section
          title="Title"
          value={audit.title}
        />

        <Section
          title="Meta Description"
          value={audit.description}
        />

        <Section
          title="H1"
          value={audit.h1}
        />

      </div>

      <div className="mt-8 text-sm text-gray-500">

        Generated at

        <br/>

        {new Date(audit.timestamp).toLocaleString()}

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="border rounded-xl p-5">

      <p className="text-gray-500 text-sm">

        {title}

      </p>

      <h3 className="text-xl font-semibold mt-2 break-all">

        {value || "-"}

      </h3>

    </div>
  );
}

function Section({ title, value }) {
  return (
    <div className="mb-6">

      <h3 className="font-semibold text-lg mb-2">

        {title}

      </h3>

      <div className="border rounded-lg p-4 bg-slate-50">

        {value || "-"}

      </div>

    </div>
  );
}