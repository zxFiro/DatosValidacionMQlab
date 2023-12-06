import listaExp from "@/Expresiones/ListaExpCompletada.json"
import PValtio from "@/utils/PValtio"

const opmapping = {
    "parentesis": 3,
    "multiplicacion": 4,
    "suma": 5,
    "resta": 6,
    "sqrt": 7,
    "division": 8,
    "potencia": 9,
    "decimales": 10
}

//in
//[evaluacion1[0].toFixed(2), evaluacion2[0].toFixed(2), flag5, flag1, flag2, flag3, flag4,""+exp[0],""+exp[1],time]
//0:evaluacion rc, 1:ev rin, 2:comp1, 3:expincompleta1, 4:expincompleta2,5:err,6:count,7:exporiginal,8:inputingresado,9:time


const TransformacionFinalDatos =  (exp: Array<Array<string>>, uid:string,it:string) => {
    let head=[
        "uid","inputtype","expid","parentesis",
        "multiplicacion","suma","resta","sqrt",
        "division","potencia","decimales","opencoded",
        "==", "evaluacionCompletada","ERR","estricto",
        "valencoded","tiempo"
    ]


    for(let i=0;i<exp.length;i++){
        let row=[
            "","","","",
            "","","","",
            "","","","",
            "","","","",
            "",""
        ]
        let value=exp[i];
        if(!value)continue;
        
        row[0]=uid;
        row[1]=it;

        //expid
        let expp=value[7]
        let oplist=listaExp[expp as keyof typeof listaExp];
        //console.log(oplist);
        row[2]=oplist[0];
        for(let k=1;k<oplist.length;k++){
            row[opmapping[oplist[k] as keyof typeof opmapping]]="1";
        }

        //operaciones presentes en la expresion
        let opencoded="";
        for(let k=3;k<11;k++){
            (row[k].localeCompare("")==0)?row[k]="0":row[k]="1";
            opencoded=opencoded+row[k];
        }
        row[11]=opencoded;

        //resultado == entre la evaluacion de exp original y exp ingresada por el usuario
        row[12]=value[2];

        //evaluacion completada (stack de calculara termina con solo 1 elemento)
        row[13]=value[4];

        //error relativo
        row[14]=value[5];

        //evaluacion estricta;
        row[15]=(value[6].localeCompare("true")==0)?"1":"0"

        //evaluacion codificada
        row[16]=""+row[13]+row[14]+row[15];

        //tiempo en segundos;
        row[17]=value[9];
        
        PValtio.data.push(row);
    }
}
//out
//[uid,IT,expid,op1..op7,opencoded,==,INC,ERR,S,valencoded,time]
//all fields treated like string, but it should as:
//[string,string,number,boolean,string,boolean,boolean,boolean,boolean,string,number]

export default TransformacionFinalDatos