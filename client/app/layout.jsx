import "./globals.css";

export const metadata = {
  title: "Page Pulse",
  description: "Production URL Audit Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        {children}
      </body>
    </html>
  );
}