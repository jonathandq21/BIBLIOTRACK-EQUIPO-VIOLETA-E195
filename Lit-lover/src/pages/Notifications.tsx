import { Bell, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const notifications = [
  { id: 1, type: "info", icon: BookOpen, title: "Nuevo libro disponible", message: '"Cien Años de Soledad" ya está disponible para préstamo.', time: "Hace 2 horas" },
  { id: 2, type: "warning", icon: AlertTriangle, title: "Préstamo por vencer", message: 'Tu préstamo de "El Principito" vence mañana.', time: "Hace 5 horas" },
  { id: 3, type: "success", icon: CheckCircle, title: "Reserva confirmada", message: 'Tu reserva de "La Casa de los Espíritus" está lista.', time: "Hace 1 día" },
];

const typeStyles = {
  info: "bg-secondary/10 text-secondary",
  warning: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
};

const Notifications = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
        <p className="text-muted-foreground mt-1">Mantente al día con tu actividad.</p>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${typeStyles[n.type as keyof typeof typeStyles]} flex items-center justify-center shrink-0`}>
              <n.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{n.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{n.time}</p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tienes notificaciones.</p>
          </div>
        )}
      </div>
    </div>
  </DashboardLayout>
);

export default Notifications;
