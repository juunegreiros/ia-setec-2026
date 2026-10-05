import { PageShell } from "@/components/layout/page-shell";
import { HealthStatus } from "@/features/health/components/health-status";

export default function Home() {
  return (
    <PageShell>
      <h1 className="text-2xl font-semibold">Sistema de pedidos</h1>
      <p className="mt-2 text-slate-600">
        A lista de produtos e o formulário de pedido serão construídos ao vivo,
        slice por slice. Por enquanto, esta página só confere se a API está no
        ar.
      </p>
      <div className="mt-8">
        <HealthStatus />
      </div>
    </PageShell>
  );
}
