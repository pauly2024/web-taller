export interface TallerData {
  nombre: string;
  rubro: string;
  servicios: string[];
  whatsapp: string;
  direccion: string;
  horario: string;
  calificacion: number;
  reviews: number;
  sitioWeb?: string;
  galeria?: string[];
  valorPropuesta: string;
}

export const tallerDefault: TallerData = {
  nombre: "Taller Ejemplo",
  rubro: "Automotriz",
  servicios: [
    "Mantenimiento y reparación",
    "Diagnóstico computarizado",
    "Cambio de aceite",
    "Neumáticos",
  ],
  whatsapp: "+1 809-555-1234",
  direccion: "Av. Principal #123, Ciudad",
  horario: "Lun-Vie 8:00-18:00, Sáb 9:00-13:00",
  calificacion: 4.5,
  reviews: 128,
  valorPropuesta: "Atención rápida y precios justos para tu vehículo",
};