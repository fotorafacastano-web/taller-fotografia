import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./ContactSection.css";

const PHONE = "+34 659 01 68 56";
const PHONE_HREF = "+34659016856";
const EMAIL = "hola@rafaelcastano.com";

const contactSchema = z.object({
  name: z.string().min(2, "Cuéntame al menos tu nombre."),
  email: z.string().email("Necesito un email válido para responderte."),
  phone: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Dame un par de líneas más sobre tu proyecto."),
});

type ContactFormData = z.infer<typeof contactSchema>;

const BUDGET_OPTIONS = ["< 1.000€", "1.000€ – 3.000€", "3.000€ – 8.000€", "+ 8.000€"];

export default function ContactSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [hovering, setHovering] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight;
      const start = vh * 0.95;
      const end = vh * 0.55;

      lineRefs.current.forEach((line) => {
        if (!line) return;
        const rect = line.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        line.style.opacity = String(progress);
        line.style.transform = `translateY(${(1 - progress) * 28}px)`;
      });

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(`Proyecto nuevo — ${data.name}`);
    const body = encodeURIComponent(
      `Nombre: ${data.name}\nEmail: ${data.email}\nTeléfono: ${data.phone || "—"}\nPresupuesto: ${data.budget || "—"}\n\nMensaje:\n${data.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    reset();
  };

  return (
    <section className="ct-section" id="contacto">
      <p className="ct-label">( Hablemos )</p>

      <h2
        className={`ct-headline${hovering ? " is-hovering" : ""}`}
        ref={headlineRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <span className="ct-line">
          <span className="ct-line-inner" ref={(el) => { lineRefs.current[0] = el; }}>
            Tu marca tiene algo que decir.
          </span>
        </span>
        <span className="ct-line">
          <span
            className="ct-line-inner ct-headline-accent"
            ref={(el) => { lineRefs.current[1] = el; }}
          >
            Hagamos que se note.
          </span>
        </span>
      </h2>

      <div className="ct-body">
        <div className="ct-direct">
          <a href={`tel:${PHONE_HREF}`} className="ct-direct-item">
            <span className="ct-direct-label">Llámame ahora</span>
            <span className="ct-direct-value">{PHONE}</span>
          </a>
          <a href={`mailto:${EMAIL}`} className="ct-direct-item">
            <span className="ct-direct-label">Escríbeme</span>
            <span className="ct-direct-value">{EMAIL}</span>
          </a>
          <p className="ct-direct-note">
            Respondo en menos de 24h. Sin compromiso, sin powerpoints aburridos.
          </p>
        </div>

        <form className="ct-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="ct-field">
            <label htmlFor="ct-name">Nombre</label>
            <input id="ct-name" type="text" placeholder="¿Cómo te llamas?" {...register("name")} />
            {errors.name && <span className="ct-error">{errors.name.message}</span>}
          </div>

          <div className="ct-field-row">
            <div className="ct-field">
              <label htmlFor="ct-email">Email</label>
              <input id="ct-email" type="email" placeholder="tu@email.com" {...register("email")} />
              {errors.email && <span className="ct-error">{errors.email.message}</span>}
            </div>
            <div className="ct-field">
              <label htmlFor="ct-phone">Teléfono (opcional)</label>
              <input id="ct-phone" type="tel" placeholder="+34 ..." {...register("phone")} />
            </div>
          </div>

          <div className="ct-field">
            <label htmlFor="ct-budget">Presupuesto orientativo</label>
            <select id="ct-budget" defaultValue="" {...register("budget")}>
              <option value="" disabled>
                Elige un rango
              </option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="ct-field">
            <label htmlFor="ct-message">Cuéntame tu proyecto</label>
            <textarea
              id="ct-message"
              rows={4}
              placeholder="Qué necesitas, para cuándo, y qué te gustaría lograr..."
              {...register("message")}
            />
            {errors.message && <span className="ct-error">{errors.message.message}</span>}
          </div>

          <button type="submit" className="ct-submit">
            {isSubmitSuccessful ? "¡Mensaje listo, revisa tu correo!" : "Enviar mi proyecto →"}
          </button>
        </form>
      </div>
    </section>
  );
}
