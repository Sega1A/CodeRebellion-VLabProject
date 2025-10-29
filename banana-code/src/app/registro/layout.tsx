// src/app/registro/layout.tsx
export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      {children}
    </div>
  );
}
