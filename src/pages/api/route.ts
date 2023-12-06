import PValtio from "@/utils/PValtio";
import prisma from "../../../lib/prisma";

export const POST= async (req,res) =>{
    let datos=req.body.task;
    for (let i = 0; i < datos.length; i++) {
        let value = datos[i];
        if (!value) continue;
        await prisma.data.create({
            data: {
                uid: value[0],
                inputtype: value[1],
                expid: value[2],
                parentesis: value[3],
                multiplicacion: value[4],
                suma: value[5],
                resta: value[6],
                sqrt: value[7],
                division: value[8],
                potencia: value[9],
                decimales: value[10],
                opencoded: value[11],
                equals: value[12],
                evaluacionCompletada: value[13],
                ERR: value[14],
                estricto: value[15],
                valencoded: value[16],
                tiempo: value[17]
            }
        }).catch(e=>{console.log(e)})
    }
}

export default POST;