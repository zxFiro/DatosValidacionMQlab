import { addStyles, StaticMathField } from "react-mathquill";
import { useState, useEffect } from "react";

addStyles();

//wrapper created because expresion elements render distorted on document changes
const MQStaticMathField = ({ exp, currentExpIndex }: { exp: string; currentExpIndex: boolean }) => {
  const [texExp, setTexExp] = useState(exp);
  useEffect(() => {
    (currentExpIndex)?setTexExp(exp+" "):setTexExp(exp);
  }, [currentExpIndex]);

  return <StaticMathField >{texExp}</StaticMathField>;
};
export default MQStaticMathField;