"use client";
import Link from "next/link";
import React from "react";

export default function RegistradosPage() {
  return (
    <>
      <style>{`
        .ac-wrapper{
          position:relative;
          min-height:100vh;
          background: radial-gradient(120% 70% at 50% -10%, #fff7ec 0%, #fff9f1 45%, #fffaf5 70%, #fffcf9 100%);
          overflow:hidden;
        }
        .bg-banana{ position:fixed; pointer-events:none; z-index:0; opacity:.10; filter: drop-shadow(0 6px 14px rgba(0,0,0,.05)); }
        .bg-left{ left:-140px; top:62%; transform:translateY(-50%) rotate(-18deg); font-size:380px; }
        .bg-right{ right:-120px; top:68%; transform:translateY(-50%) rotate(16deg); font-size:360px; }

        .ac-inner{ max-width:1400px; margin:0 auto; padding:40px 24px 80px; position:relative; z-index:2; }
        .ac-card{ background:rgba(255,255,255,.96); border:1px solid rgba(0,0,0,.07); border-radius:20px; box-shadow:0 8px 28px rgba(0,0,0,.08); overflow:hidden; backdrop-filter:blur(8px); }

        .ac-head{ display:flex; align-items:center; justify-content:space-between; padding:20px 22px 8px; }
        .ac-title{ font-size:18px; font-weight:800; }
        .ac-switch{ border:0; border-radius:999px; padding:10px 16px; cursor:pointer; background:#ffeb3b; font-weight:800; box-shadow:inset 0 -2px 0 rgba(0,0,0,.08); }

        .ac-table{ width:100%; border-collapse:collapse; table-layout:fixed; }
        .ac-th,.ac-td{ padding:14px 18px; border-bottom:1px solid rgba(0,0,0,.08); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .ac-th{ font-size:12px; font-weight:800; text-transform:uppercase; color:#3f3f3f; background:#fff; }

        colgroup col:nth-child(1){width:30%}
        colgroup col:nth-child(2){width:22%}
        colgroup col:nth-child(3){width:14%}
        colgroup col:nth-child(4){width:14%}
        colgroup col:nth-child(5){width:10%}
        colgroup col:nth-child(6){width:10%}

        .ac-empty{ padding:16px 18px; color:#666; font-size:14px; text-align:center; }

        /* FIX alineación columnas + ocultar puntos */
        .ac-table th, .ac-table td { vertical-align: middle; }
        .ac-table th:nth-child(1), .ac-table td:nth-child(1),
        .ac-table th:nth-child(2), .ac-table td:nth-child(2) { text-align:left; }
        .ac-table th:nth-child(3), .ac-table td:nth-child(3),
        .ac-table th:nth-child(4), .ac-table td:nth-child(4),
        .ac-table th:nth-child(5), .ac-table td:nth-child(5),
        .ac-table th:nth-child(6) { text-align:center; }

        .ac-action{ overflow:visible!important; text-overflow:clip!important; white-space:nowrap!important; }
        .ac-actions{ display:flex; justify-content:center; width:100%; }
      `}</style>

      <div className="ac-wrapper">
        <div className="bg-banana bg-left">🍌</div>
        <div className="bg-banana bg-right">🍌</div>

        <div className="ac-inner">
          <div className="ac-card">
            <div className="ac-head">
              <h2 className="ac-title">CURSOS REGISTRADOS</h2>
              <Link href="/admin/historicos">
                <button className="ac-switch">HISTÓRICOS</button>
              </Link>
            </div>

            <table className="ac-table">
              <colgroup><col/><col/><col/><col/><col/><col/></colgroup>
              <thead>
                <tr>
                  <th className="ac-th">Curso</th>
                  <th className="ac-th">Docente</th>
                  <th className="ac-th">Fecha Inicio</th>
                  <th className="ac-th">Fecha Fin</th>
                  <th className="ac-th">Estado</th>
                  <th className="ac-th">Acción</th>
                </tr>
              </thead>
              <tbody>
                {/* ↙️ Aquí el backend meterá las filas después */}
                <tr>
                  <td className="ac-td ac-empty" colSpan={6}>No hay cursos registrados.</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
}
