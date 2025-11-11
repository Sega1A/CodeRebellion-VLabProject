"use client";
import Link from "next/link";
import React from "react";
import "../ac.css";
import { cursosHistoricos } from "../course.mock";

export default function HistoricosPage() {
  const rows = cursosHistoricos;

  return (
    <>
      <div className="ac-wrapper">
        <div className="bg-banana bg-left">🍌</div>
        <div className="bg-banana bg-right">🍌</div>

        <div className="ac-inner">
          <div className="ac-card">
            <div className="ac-head">
              <h2 className="ac-title">CURSOS HISTÓRICOS</h2>
              <Link href="/admin/registrados">
                <button className="ac-switch">REGISTRADOS</button>
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
                {rows.length === 0 ? (
                  <tr>
                    <td className="ac-td ac-empty" colSpan={6}>No hay cursos históricos.</td>
                  </tr>
                ) : (
                  rows.map((c) => (
                    <tr key={c.id}>
                      <td className="ac-td">{c.nombre}</td>
                      <td className="ac-td">{c.docente}</td>
                      <td className="ac-td">{c.fechaInicio}</td>
                      <td className="ac-td">{c.fechaFin}</td>
                      <td className="ac-td">{c.estado}</td>
                      <td className="ac-td ac-action">
                        <div className="ac-actions">
                          <Link href={`/admin/cursos/${c.id}`}>
                            <text>Ver</text>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
}
