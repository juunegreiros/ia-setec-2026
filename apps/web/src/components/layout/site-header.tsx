export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold text-brand-dark">
          Sistema de pedidos
        </span>
        <span className="text-sm text-slate-500">Workshop</span>
      </div>
    </header>
  );
}
