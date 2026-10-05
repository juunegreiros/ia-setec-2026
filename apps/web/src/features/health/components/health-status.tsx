"use client";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { fetchHealth } from "@/features/health/api/fetch-health";

export function HealthStatus() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  if (isLoading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-medium text-slate-600">Status da API</h2>
        <p className="mt-2 text-slate-700">Verificando conexão com a API…</p>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-medium text-red-900">Status da API</h2>
          <StatusBadge label="Indisponível" variant="error" />
        </div>
        <p className="mt-2 text-sm text-red-800">
          Não foi possível falar com a API. Confira se ela está rodando com{" "}
          <code className="rounded bg-red-100 px-1">make api</code>.
        </p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
          className="mt-4"
        >
          Tentar novamente
        </Button>
      </section>
    );
  }

  const isOk = data.status === "ok";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-medium text-slate-600">Status da API</h2>
        <StatusBadge
          label={isOk ? "Online" : data.status}
          variant={isOk ? "success" : "neutral"}
        />
        {isFetching ? (
          <span className="text-xs text-slate-500">Atualizando…</span>
        ) : null}
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex gap-2">
          <dt className="font-medium text-slate-500">Serviço</dt>
          <dd>{data.service}</dd>
        </div>
      </dl>
    </section>
  );
}
