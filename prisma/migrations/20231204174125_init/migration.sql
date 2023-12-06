-- CreateTable
CREATE TABLE "Data" (
    "uid" TEXT NOT NULL,
    "inputtype" TEXT NOT NULL,
    "expid" TEXT NOT NULL,
    "parentesis" TEXT NOT NULL,
    "multiplicacion" TEXT NOT NULL,
    "suma" TEXT NOT NULL,
    "resta" TEXT NOT NULL,
    "sqrt" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "potencia" TEXT NOT NULL,
    "decimales" TEXT NOT NULL,
    "opencoded" TEXT NOT NULL,
    "equals" TEXT NOT NULL,
    "evaluacionCompletada" TEXT NOT NULL,
    "ERR" TEXT NOT NULL,
    "estricto" TEXT NOT NULL,
    "valencoded" TEXT NOT NULL,
    "tiempo" TEXT NOT NULL,

    PRIMARY KEY ("uid", "inputtype", "expid")
);
