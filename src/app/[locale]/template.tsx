export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "page-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1) both" }}>
      {children}
    </div>
  );
}
