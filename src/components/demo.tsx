import { InteractiveTravelCard } from "@/components/ui/3d-card";

export default function InteractiveTravelCardDemo() {
  return (
    <div className="flex flex-wrap gap-8 my-auto w-full max-w-6xl items-center justify-center p-4">
       <div style={{ perspective: "1000px" }}>
        <InteractiveTravelCard
          title="Arquitectura"
          subtitle="Sistemas y Hardware"
          imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
          actionText="Entrar al Laboratorio"
          href="/arquitectura"
          onActionClick={() => { window.location.href = '/arquitectura'; }}
        />
      </div>
      <div style={{ perspective: "1000px" }}>
        <InteractiveTravelCard
          title="Computación Gráfica"
          subtitle="Renderizado Visual"
          imageUrl="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
          actionText="Entrar al Laboratorio"
          href="/grafica"
          onActionClick={() => { window.location.href = '/grafica'; }}
        />
      </div>
      <div style={{ perspective: "1000px" }}>
        <InteractiveTravelCard
          title="Interacción Humano-PC"
          subtitle="Diseño de Interfaces"
          imageUrl="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800"
          actionText="Entrar al Laboratorio"
          href="/ihc"
          onActionClick={() => { window.location.href = '/ihc'; }}
        />
      </div>
      <div style={{ perspective: "1000px" }}>
        <InteractiveTravelCard
          title="Bases de Datos"
          subtitle="Avanzado y Big Data"
          imageUrl="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800"
          actionText="Entrar al Laboratorio"
          href="/bd"
          onActionClick={() => { window.location.href = '/bd'; }}
        />
      </div>
      <div style={{ perspective: "1000px" }}>
        <InteractiveTravelCard
          title="Modelamiento"
          subtitle="Análisis de Software"
          imageUrl="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"
          actionText="Entrar al Laboratorio"
          href="/modelamiento"
          onActionClick={() => { window.location.href = '/modelamiento'; }}
        />
      </div>
    </div>
  );
}
