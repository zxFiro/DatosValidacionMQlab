import { proxy } from "valtio";
import DMQPostfixparser from "./DMQPostfixparser";
import MQPostfixSolver from "./MQPostfixSolver";
import MQPostfixstrict from "./MQPostfixstrict";
import TransformacionFinalDatos from "@/components/TransformacionFinalDatos";

import A395 from "../Expresiones/A395.json"
import D400 from "../Expresiones/D400.json"
import C402 from "../Expresiones/C402.json"

interface tablapython {
  index: Array<number>
  columns: Array<string>
  data: Array<Array<string | number>>
}
interface potato {
  ascii: tablapython
  mathquill: tablapython
}
interface tablaEv {
  list: Array<potato>
}

const values = [
  {
      "name": "a",
      "value": 1
  },
  {
      "name": "b",
      "value": 4
  },
  {
      "name": "c",
      "value": 1
  }
]
const errorRelativo = (vals: Array<number>) => {
  let relativeError = Math.abs(1 - (vals[0] / vals[1]));
  return (relativeError < 0.005) ? 1 : 0;
}

//exp[0]:respuesta correcta, exp[1]:respuesta ingresada
const validacion = (exp: Array<string> ) => {
  let traduccion1 = DMQPostfixparser(""+exp[0]);
  let traduccion2 = DMQPostfixparser(""+exp[1]);
  let evaluacion1 = MQPostfixSolver(traduccion1, values);
  let evaluacion2 = MQPostfixSolver(traduccion2, values);
  let flag1 = 1;
  let flag2 = 1;
  let flag3 = errorRelativo([evaluacion1[0], evaluacion2[0]])
  let flag4 = MQPostfixstrict(traduccion1, traduccion2);
  let flag5 = (evaluacion1[0] == evaluacion2[0]) ?1:0
  if (evaluacion1.length > 1) flag1 = 0;
  if (evaluacion2.length > 1) flag2 = 0;
  //evaluacion rc, ev rin, comp1, expincompleta1, expincompleta2,err,count
  return [evaluacion1[0].toFixed(2), evaluacion2[0].toFixed(2), flag5, flag1, flag2, flag3, flag4,""+exp[0],""+exp[1]]
}

const procesarData = (datos: tablaEv,tipo:boolean,uid:string) => {
  let tablerow = []
  for (let i = 0; i < datos.list.length; i++) {
      //filtro las filas que tengan valor first change o submit
      let firstChange = 0;
      let subvals:Array<Array<string>>=[];
      let e=(tipo)?datos.list[i].ascii.data:datos.list[i].mathquill.data
      //console.log(e.length)
      for (let j = 0; j < e.length; j++) {
          let temp1 = e[j];
          let temp2 = ""+temp1[3];
          if (temp2.localeCompare("first change") == 0) {
              let temp3 = Number(temp1[2]);
              firstChange = temp3;
          } else if (temp2.localeCompare("submit") == 0) {
              subvals.push([""+temp1[0],""+temp1[1],""+temp1[2],""+temp1[3]])
          }
      }
      let iPrimerInCorrecto = 0;
      let flag = true;
      //obtengo el indice del primer ingreso correcto
      for (let j = 1; j < subvals.length; j++) {
          let temp = validacion([String(subvals[j][0]), String(subvals[j][1])] )
          if (temp[5] == 1 && temp[6] == 1 && flag) {
              iPrimerInCorrecto = j
              flag = false
          }
      }

      //obtengo el tiempo del ultimo submit con limite < 3 ingresos o el tiempo del primer ingreso correcto
      let temp1=0;
      let indice=0;
      if (iPrimerInCorrecto > 0) temp1 = (subvals[iPrimerInCorrecto][2] as unknown as number)
      else temp1 = (subvals.length > 3) ? Number(subvals[3][2]) : Number(subvals[(subvals.length-1)][2])
      let time = temp1 - firstChange;
      time=Number(time)/1000;
      time=Number(time.toFixed(2));

      //construyo la fila comprimida
      indice=(iPrimerInCorrecto>0)?iPrimerInCorrecto:(subvals.length > 3)?3:(subvals.length - 1)
      let val=validacion([(subvals[indice][0] as unknown as string), (subvals[indice][1] as unknown as string)] )
      val.push(time)
      let fila = []
      for(let j=0;j<val.length;j++)fila.push(""+val[j])
      tablerow.push(fila)
  }
  return tablerow
}

interface initialTable{
  a:Array<Array<string>>,
  b:Array<Array<string>>,
  c:Array<Array<string>>,
  a2:Array<Array<string>>,
  b2:Array<Array<string>>,
  c2:Array<Array<string>>,
}

interface sharedValues {
  data:Array<Array<string>>,
  procesedData:initialTable,
  executeOnce:boolean
}


const initialObj: sharedValues = {
  executeOnce:true,
  data:[],
  procesedData:{
    a:procesarData(A395,true,"A395"),
    b:procesarData(D400,true,"D400"),
    c:procesarData(C402,true,"C402"),
    a2:procesarData(A395,false,"A395"),
    b2:procesarData(D400,false,"D400"),
    c2:procesarData(C402,false,"C402")
  }
};

const PValtio = proxy(initialObj);

export const reset = () => {
  Object.assign(PValtio, initialObj);
};

export default PValtio;