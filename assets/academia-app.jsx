// Academia Pilar Garijo — Área privada (prototipo)
// Login simulado → curso contratado con lecciones, visor, notas y exportación.

const CURSO = {
  titulo: "Curso de Masaje Método Garijo",
  modulos: [
    {
      nombre: "Módulo 1 · Introducción",
      lecciones: [
        { id: "l01", nombre: "Bienvenida al curso", dur: "04:32" },
        { id: "l02", nombre: "Cómo aprovechar la formación", dur: "06:15" },
      ],
    },
    {
      nombre: "Módulo 2 · Fundamentos del método",
      lecciones: [
        { id: "l03", nombre: "Principios del Método Garijo", dur: "18:40" },
        { id: "l04", nombre: "Preparación, camilla y entorno", dur: "12:05" },
        { id: "l05", nombre: "Las manos: presión y ritmo", dur: "21:18" },
      ],
    },
    {
      nombre: "Módulo 3 · El masaje completo",
      lecciones: [
        { id: "l06", nombre: "Espalda I", dur: "24:50" },
        { id: "l07", nombre: "Espalda II", dur: "19:32" },
        { id: "l08", nombre: "Zona cervical", dur: "16:44" },
        { id: "l09", nombre: "Extremidades inferiores", dur: "22:10" },
        { id: "l10", nombre: "La secuencia completa", dur: "32:00" },
      ],
    },
    {
      nombre: "Módulo 4 · Aplicación en consulta",
      lecciones: [
        { id: "l11", nombre: "Protocolos con tus clientes", dur: "14:25" },
        { id: "l12", nombre: "Cierre y siguientes pasos", dur: "08:12" },
      ],
    },
  ],
};

const LECCIONES = CURSO.modulos.flatMap((m) => m.lecciones);

// Texto de cada lección (contenido provisional hasta tener el real)
function textoLeccion(leccion) {
  return [
    `En esta lección, Pilar desarrolla «${leccion.nombre}» dentro del ${CURSO.titulo}. Mira el vídeo completo antes de pasar a la siguiente lección: cada gesto del método se apoya en el anterior.`,
    "Debajo tienes el espacio de notas. Apunta lo que quieras recordar al aplicar la técnica en tu consulta: presiones, ritmos, errores a evitar. Al terminar el curso podrás exportar todas tus notas en un solo documento.",
  ];
}

// --- persistencia ---
const LS_NOTAS = "pg-academia-notas";
const LS_HECHAS = "pg-academia-completadas";
const LS_LECCION = "pg-academia-leccion";
const LS_SESION = "pg-academia-sesion";

function leerLS(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v ? JSON.parse(v) : porDefecto;
  } catch (e) {
    return porDefecto;
  }
}

// ============================================================
// Login
// ============================================================
function LoginScreen({ onLogin }) {
  const enviar = (e) => {
    e.preventDefault();
    onLogin();
  };
  return (
    <div className="login-screen" data-screen-label="Login">
      <div className="login-card">
        <div className="wordmark">
          <img src="assets/logo.png" alt="Pilar Garijo" className="wordmark-logo" />
          <span>Academia</span>
        </div>
        <h1>Área privada de alumnos</h1>
        <p className="hint">Accede con los datos que recibiste al inscribirte.</p>
        <form className="login-form" onSubmit={enviar}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" placeholder="tu@email.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Contraseña</label>
            <input id="login-pass" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <div className="login-aux">
            <span></span>
            <a href="#" onClick={(e) => e.preventDefault()}>¿Has olvidado la contraseña?</a>
          </div>
          <button className="btn btn--solid" type="submit">Entrar</button>
        </form>
        <p className="login-back">
          <a href="index.html">← Volver a la academia</a>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Área privada
// ============================================================
function AreaPrivada({ onLogout }) {
  const [leccionId, setLeccionId] = React.useState(() => leerLS(LS_LECCION, "l01"));
  const [notas, setNotas] = React.useState(() => leerLS(LS_NOTAS, {}));
  const [hechas, setHechas] = React.useState(() => leerLS(LS_HECHAS, []));

  const leccion = LECCIONES.find((l) => l.id === leccionId) || LECCIONES[0];
  const idx = LECCIONES.indexOf(leccion);
  const numero = (i) => String(i + 1).padStart(2, "0");

  React.useEffect(() => {
    localStorage.setItem(LS_LECCION, JSON.stringify(leccionId));
  }, [leccionId]);

  const cambiarNota = (texto) => {
    const siguientes = { ...notas, [leccion.id]: texto };
    setNotas(siguientes);
    localStorage.setItem(LS_NOTAS, JSON.stringify(siguientes));
  };

  const alternarHecha = (id) => {
    const siguientes = hechas.includes(id)
      ? hechas.filter((h) => h !== id)
      : [...hechas, id];
    setHechas(siguientes);
    localStorage.setItem(LS_HECHAS, JSON.stringify(siguientes));
  };

  const exportarNotas = () => {
    const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    let texto = `MIS NOTAS — ${CURSO.titulo.toUpperCase()}\n`;
    texto += `Academia Pilar Garijo · Exportado el ${fecha}\n`;
    texto += "=".repeat(56) + "\n\n";
    let conNotas = 0;
    LECCIONES.forEach((l, i) => {
      const nota = (notas[l.id] || "").trim();
      if (!nota) return;
      conNotas++;
      texto += `Lección ${numero(i)} — ${l.nombre}\n`;
      texto += "-".repeat(40) + "\n";
      texto += nota + "\n\n";
    });
    if (conNotas === 0) {
      texto += "(Todavía no has escrito ninguna nota.)\n";
    }
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Mis notas - Curso de Masaje Metodo Garijo.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const completadas = hechas.filter((id) => LECCIONES.some((l) => l.id === id)).length;
  const pct = Math.round((completadas / LECCIONES.length) * 100);

  return (
    <div className="app" data-screen-label="Área privada">
      <header className="app-header">
        <div className="app-header-inner">
          <a className="wordmark" href="index.html">
            <img src="assets/logo.png" alt="Pilar Garijo" className="wordmark-logo" />
            <span>Área privada</span>
          </a>
          <div className="app-user">
            <span>Hola, alumna/o</span>
            <div className="avatar">A</div>
            <button type="button" onClick={onLogout}>Salir</button>
          </div>
        </div>
      </header>

      <div className="app-body">
        {/* ---------- menú de lecciones ---------- */}
        <aside className="sidebar" data-screen-label="Lecciones">
          <div className="course-head">
            <p className="kicker">Tu curso</p>
            <h2>{CURSO.titulo}</h2>
            <div className="progress">
              <div className="progress-bar"><i style={{ width: pct + "%" }}></i></div>
              <span>{completadas} de {LECCIONES.length} lecciones · {pct}%</span>
            </div>
          </div>

          <nav className="lesson-nav">
            {CURSO.modulos.map((modulo) => (
              <div key={modulo.nombre}>
                <p className="module-label">{modulo.nombre}</p>
                {modulo.lecciones.map((l) => {
                  const i = LECCIONES.indexOf(l);
                  const activa = l.id === leccion.id;
                  const hecha = hechas.includes(l.id);
                  const tieneNota = !!(notas[l.id] || "").trim();
                  return (
                    <button
                      key={l.id}
                      type="button"
                      className={"lesson-item" + (activa ? " active" : "") + (hecha ? " done" : "")}
                      onClick={() => setLeccionId(l.id)}
                    >
                      <span className="lesson-status">
                        {hecha ? (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4 L3.8 6.8 L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                          </svg>
                        ) : (
                          numero(i)
                        )}
                      </span>
                      <span className="lesson-name">{l.nombre}</span>
                      {tieneNota && <span className="has-note" title="Tiene notas"></span>}
                      <span className="lesson-dur">{l.dur}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="btn btn--solid" type="button" onClick={exportarNotas}>
              Exportar todas las notas
            </button>
          </div>
        </aside>

        {/* ---------- visor ---------- */}
        <main className="viewer" data-screen-label="Visor de lección">
          <div className="video-frame">
            <button className="play" type="button" aria-label="Reproducir vídeo">
              <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
                <path d="M1 1.5 L25 15 L1 28.5 Z" fill="currentColor"></path>
              </svg>
            </button>
            <span className="video-caption">Lección {numero(idx)} · Vídeo</span>
            <span className="video-dur">{leccion.dur}</span>
          </div>

          <div className="lesson-head">
            <span className="kicker">Lección {numero(idx)} de {numero(LECCIONES.length - 1)}</span>
            <h1>{leccion.nombre}</h1>
            <div className="lesson-meta">
              <button
                type="button"
                className={"mark-done" + (hechas.includes(leccion.id) ? " is-done" : "")}
                onClick={() => alternarHecha(leccion.id)}
              >
                {hechas.includes(leccion.id) ? "✓ Lección completada" : "Marcar como completada"}
              </button>
            </div>
          </div>

          <div className="lesson-text">
            <h3>Sobre esta lección</h3>
            {textoLeccion(leccion).map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>

          <div className="notes">
            <div className="notes-head">
              <h3>Mis notas</h3>
              <span>Se guardan automáticamente</span>
            </div>
            <textarea
              value={notas[leccion.id] || ""}
              placeholder="Escribe aquí tus apuntes de esta lección…"
              onChange={(e) => cambiarNota(e.target.value)}
            ></textarea>
          </div>

          <div className="lesson-pager">
            <button
              className="btn btn--ghost"
              type="button"
              disabled={idx === 0}
              onClick={() => setLeccionId(LECCIONES[idx - 1].id)}
            >
              ← Anterior
            </button>
            <button
              className="btn btn--solid"
              type="button"
              disabled={idx === LECCIONES.length - 1}
              onClick={() => setLeccionId(LECCIONES[idx + 1].id)}
            >
              Siguiente →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================
// Raíz
// ============================================================
function AcademiaApp() {
  // Siempre se entra por el login: no recordamos la sesión al cargar la página.
  const [dentro, setDentro] = React.useState(false);

  const entrar = () => { setDentro(true); };
  const salir = () => { setDentro(false); };

  return dentro ? <AreaPrivada onLogout={salir} /> : <LoginScreen onLogin={entrar} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<AcademiaApp />);
