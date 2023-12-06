import { Button, Center } from "@chakra-ui/react"
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import input1 from "../Expresiones/IngresoUsuario1.json"
import input2 from "../Expresiones/IngresoUsuario2.json"
import input3 from "../Expresiones/IngresoUsuario3.json"

import { useEffect, useRef, useState } from "react"

import dynamic from "next/dynamic";
import PValtio,{reset} from "@/utils/PValtio"
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

const TabladeEvaluacion = ({refresh,tkey}: {refresh: boolean,tkey:string}) => {
    const poblartabla = (tabla:Array<Array<string>>,tipo:boolean) => {
        return (
            tabla.map((m, i) => (
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

    let value = PValtio.procesedData;

    let t1:Array<Array<string>>=[];
    let t2:Array<Array<string>>=[];

    let flag=true;

    if (value!=null){
        if (tkey=="a") {
            t1=value.a;
            t2=value.a2;
        } else if (tkey=="b") {
            t1=value.b;
            t2=value.b2;
        } else if (tkey=="c") {
            t1=value.c;
            t2=value.c2;
        }
    }else{
        flag=false;
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
                    {(flag)?poblartabla(t1,true):(<></>)}
                    <Tr><Td>MQ2</Td></Tr>
                    {(flag)?poblartabla(t2,false):(<></>)}
                </Thead>
            </Table>
        </TableContainer>
    )
}

const handleBClick= ()=>{
    if(PValtio.executeOnce){
        TransformacionFinalDatos(PValtio.procesedData.a,"A395","ASCII");
        TransformacionFinalDatos(PValtio.procesedData.b,"D400","ASCII");
        TransformacionFinalDatos(PValtio.procesedData.c,"C402","ASCII");
        TransformacionFinalDatos(PValtio.procesedData.a2,"A395","MATHQUILL");
        TransformacionFinalDatos(PValtio.procesedData.b2,"D400","MATHQUILL");
        TransformacionFinalDatos(PValtio.procesedData.c2,"C402","MATHQUILL");
        PValtio.executeOnce=false;
        fetch("http://localhost:3000/api/route", {
            method: "POST",
            body: JSON.stringify({ task: PValtio.data }),
            headers: {
            "Content-Type": "application/json",
            },
        })
        
    }
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
                        <TabladeEvaluacion refresh={update} tkey={"a"}/>
                    </TabPanel>
                    <TabPanel>
                        <TabladeEvaluacion refresh={update} tkey={"b"}/>
                    </TabPanel>
                    <TabPanel>
                        <TabladeEvaluacion refresh={update} tkey={"c"}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Button onClick={()=>{handleBClick();}}>Exportar datos</Button>
        </Center>
    )
}

export default DepuracionManualDeEvaluacion