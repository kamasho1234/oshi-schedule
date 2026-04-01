interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`max-w-lg mx-auto px-4 pb-24 pt-4 ${className}`}>
      {children}
    </main>
  );
}
