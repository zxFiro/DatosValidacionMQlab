import dynamic from "next/dynamic";
const Depuracion = dynamic(
    () => {
      return import("@/components/DepuracionManualDeEvaluacion");
    },
    { ssr: false },
);
export default function Page() {
    return <Depuracion/> 
}