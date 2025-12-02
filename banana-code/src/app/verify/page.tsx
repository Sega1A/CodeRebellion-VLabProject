import { Suspense } from "react";
import VerifyContent from "./components/VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Iniciando verificación...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
