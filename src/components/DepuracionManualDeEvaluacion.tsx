import { Center } from "@chakra-ui/react"
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import input1 from "../Expresiones/IngresoUsuario1.json"
import input2 from "../Expresiones/IngresoUsuario2.json"
import input3 from "../Expresiones/IngresoUsuario3.json"
import A395 from "../Expresiones/A395.json"
import D400 from "../Expresiones/D400.json"
import C402 from "../Expresiones/C402.json"

import { useEffect, useRef, useState } from "react"

import dynamic from "next/dynamic";
import MQPostfixSolver from "@/utils/MQPostfixSolver"
import DMQPostfixparser from "@/utils/DMQPostfixparser"
import MQPostfixstrict from "@/utils/MQPostfixstrict"
import TransformacionFinalDatos from "./TransformacionFinalDatos"

const StaticMath = dynamic(
    () => {
        return import("@/utils/MQStaticMathField");
    },
    { ssr: false },
);

interface tabla {
    caption: string,
    datos: Array<Array<string>>
}

const TabladeComparacion1 = ({datos,refresh}:{datos: tabla, refresh: boolean}) => {
    const poblartabla = () => {
        return (
            datos.datos.slice(1).map((m, i) => (
                <Tr key={"TC1Tr" + i} >
                    <Td key={i + "TC1Td" + "MQEXP"} p={"3"}><StaticMath exp={m[0]} currentExpIndex={refresh} /></Td>
                    <Td key={i + "TC1Td" + "ASCIIIN"} p={"3"}>{m[1]}</Td>
                    <Td key={i + "TC1Td" + "MQIN"} p={"3"}><StaticMath exp={m[2]} currentExpIndex={refresh} /></Td>
                </Tr>

            ))
        )
    }
    const [tablaPoblada, setTablaPoblada] = useState(poblartabla())

    useEffect(
        () => {
            setTablaPoblada(poblartabla())
        }
        , [refresh])
    return (
        <TableContainer key={"TCTC1"}>
            <Table key={"TCT1"} variant='simple'>
                <TableCaption key={"TCC1"}>{datos.caption}</TableCaption>
                <Thead key={"TCH1"}>
                    <Tr>
                        {
                            datos.datos[0].map((e, i) => (
                                <Th key={"Th" + i}>{e}</Th>
                            )
                            )
                        }
                    </Tr>
                    {tablaPoblada}
                </Thead>
            </Table>
        </TableContainer>
    )
}

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
    TransformacionFinalDatos(tablerow,uid,((tipo)?"ASCII":"MQ2"))
    return tablerow
}
const TabladeEvaluacion = ({ datos, refresh, uid}: { datos: tablaEv, refresh: boolean , uid:string}) => {
    const poblartabla = (tipo:boolean) => {
        return (
            procesarData(datos,tipo,uid).map((m, i) => (
                <Tr key={"ASCIIev" + i} >
                    <Td key={i + "ASCIIev" + "m8"} p={"3"}><StaticMath exp={m[7] as string} currentExpIndex={refresh} /></Td>
                    <Td key={i + "ASCIIev" + "m9"} p={"3"}>{(tipo)?m[8]:<StaticMath exp={m[8] as string} currentExpIndex={refresh} />}</Td>
                    <Td key={i + "ASCIIev" + "MQEXP"} p={"3"}>{m[0]}</Td>
                    <Td key={i + "ASCIIev" + "ASCIIIN"} p={"3"}>{m[1]}</Td>
                    <Td key={i + "ASCIIev" + "m2"} p={"3"}>{m[2]}</Td>
                    <Td key={i + "ASCIIev" + "m3"} p={"3"}>{m[3]}</Td>
                    <Td key={i + "ASCIIev" + "m4"} p={"3"}>{m[4]}</Td>
                    <Td key={i + "ASCIIev" + "m5"} p={"3"}>{m[5]}</Td>
                    <Td key={i + "ASCIIev" + "m6"} p={"3"}>{m[6]}</Td>
                    <Td key={i + "ASCIIev" + "m7"} p={"3"}>{m[9]}</Td>
                </Tr>
            ))
        )
    }
    return (
        <TableContainer key={"TCTC1"}>
            <Table key={"TCT1"} variant='simple'>
                <TableCaption key={"TCC1"}>{"potato to be added"}</TableCaption>
                <Thead key={"TCH1"}>
                    <Tr>
                        <Th key={"Th" + 7}>Expresion</Th>
                        <Th key={"Th" + 8}>Input</Th>
                        <Th key={"Th" + 0}>EvExp</Th>
                        <Th key={"Th" + 1}>EvIn</Th>
                        <Th key={"Th" + 2}>==</Th>
                        <Th key={"Th" + 3}>ExpCorrecta</Th>
                        <Th key={"Th" + 4}>InCorrecto</Th>
                        <Th key={"Th" + 5}>Err</Th>
                        <Th key={"Th" + 6}>Estricto</Th>
                        <Th key={"Th" + 9}>Tiempo(s)</Th>
                    </Tr>
                    {poblartabla(true)}
                    <Tr><Td>MQ2</Td></Tr>
                    {poblartabla(false)}
                </Thead>
            </Table>
        </TableContainer>
    )
}



const DepuracionManualDeEvaluacion = () => {
    const [update, setUpdate] = useState(true);
    return (
        <Center>
            <Tabs variant='soft-rounded' colorScheme='teal' >
                <TabList>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>A395 comparacion</Tab>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>D400 comparacion</Tab>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>C402 comparacion</Tab>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>A395 evaluacion</Tab>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>D400 evaluacion</Tab>
                    <Tab onClick={() => { setUpdate(update ? false : true) }}>C402 evaluacion</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <TabladeComparacion1 datos={input1} refresh={update} />
                    </TabPanel>
                    <TabPanel>
                        <TabladeComparacion1 datos={input2} refresh={update} />
                    </TabPanel>
                    <TabPanel>
                        <TabladeComparacion1 datos={input3} refresh={update} />
                    </TabPanel>
                    <TabPanel>
                        <TabladeEvaluacion datos={A395} uid={"A395"} refresh={update} />
                    </TabPanel>
                    <TabPanel>
                        <TabladeEvaluacion datos={D400} uid={"D400"} refresh={update} />
                    </TabPanel>
                    <TabPanel>
                        <TabladeEvaluacion datos={C402} uid={"C402"}refresh={update} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Center>
    )
}

export default DepuracionManualDeEvaluacion