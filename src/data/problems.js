export const todosLosProblemas = [
            {
                id: 1,
                title: "Problema 1: Control de ventilación de un procesador",
                description: "Un sistema digital controla el ventilador de enfriamiento mediante dos señales: \n• T: vale 1 cuando la temperatura es alta.\n• P: vale 1 cuando ejecuta tarea de alta carga.\nLa salida S (ventilador) deberá encenderse cuando la temperatura sea alta o cuando trabaje con alta carga.",
                inputs: ["T", "P"],
                output: "S",
                correctTable: [0, 1, 1, 1], 
                solutionSteps: "S = T'P + T P' + TP\nS = T'P + TP + T P' + TP\nS = P(T' + T) + T(P' + P)\nS = P(1) + T(1)\nS = P + T",
                finalExpression: "S = P + T",
                acceptableFinals: ["s=p+t", "s=t+p", "p+t", "t+p"],
                minLines: 2,
                hints: [
                    "Observa la tabla de verdad: identifica los 3 casos donde la salida S es 1 y forma tu ecuación inicial sumándolos.",
                    "Aplica la regla de Idempotencia (A + A = A). Puedes duplicar el término 'TP' para tener 4 términos en total.",
                    "Agrupa (factoriza) 'P' en los primeros términos y 'T' en los últimos. Recuerda que (X + X') = 1."
                ]
            },
            {
                id: 2,
                title: "Problema 2: Habilitación de computadora",
                description: "Una computadora posee tres señales:\n• E: conectado a energía.\n• F: fuente funcionando.\n• T: temperatura permitida.\nLa salida H habilita el PC solamente cuando las tres condiciones sean correctas simultáneamente.",
                inputs: ["E", "F", "T"],
                output: "H",
                correctTable: [0, 0, 0, 0, 0, 0, 0, 1],
                solutionSteps: "Dado que solo hay un estado activo en la tabla (111), la expresión se extrae directamente sin simplificación compleja:\nH = E F T",
                finalExpression: "H = E F T",
                acceptableFinals: ["h=eft", "h=e*f*t", "h=e·f·t", "eft", "e·f·t", "e*f*t"],
                minLines: 1,
                hints: [
                    "Revisa la tabla de verdad: ¿En cuántos casos la salida H es 1?",
                    "Al haber solo un caso donde H=1 (cuando todas las entradas son 1), no hay simplificación que hacer.",
                    "Escribe directamente la multiplicación de las tres entradas para ese caso único."
                ]
            },
            {
                id: 3,
                title: "Problema 3: Alarma de servidor",
                description: "Un servidor posee 3 sensores (A, B, C). La salida AL activa una alarma cuando DOS O MÁS sensores detectan temperatura elevada simultáneamente.",
                inputs: ["A", "B", "C"],
                output: "AL",
                correctTable: [0, 0, 0, 1, 0, 1, 1, 1], 
                solutionSteps: "AL = A'BC + AB'C + ABC' + ABC\nAL = A'BC + ABC + AB'C + ABC + ABC' + ABC\nAL = BC(A' + A) + AC(B' + B) + AB(C' + C)\nAL = BC(1) + AC(1) + AB(1)\nAL = BC + AC + AB",
                finalExpression: "AL = BC + AC + AB",
                acceptableFinals: ["al=bc+ac+ab", "al=ab+bc+ac", "al=ab+ac+bc", "bc+ac+ab", "ab+bc+ac", "ab+ac+bc"],
                minLines: 2,
                hints: [
                    "Busca los casos en la tabla donde haya dos o más 1s en las entradas. Tendrás 4 términos iniciales.",
                    "Usa la regla de Idempotencia: Puedes duplicar el término 'ABC' varias veces sin alterar la lógica.",
                    "Agrupa (factoriza) de a dos términos para poder aplicar la regla del complemento (X + X' = 1) en cada grupo."
                ]
            },
            { 
                id: 4, 
                title: "Problema 4: Luces de pasillo (Reto)", 
                description: "La luz (L) de un pasillo se enciende si el sensor izquierdo (I) o el derecho (D) detectan movimiento.",
                inputs: ["I", "D"], 
                output: "L", 
                correctTable: [0, 1, 1, 1], 
                solutionSteps: "L = I'D + ID' + ID\nL = D(I'+I) + I(D'+D)\nL = D(1) + I(1)\nL = I + D", 
                finalExpression: "L = I + D",
                acceptableFinals: ["l=i+d", "l=d+i", "i+d", "d+i"],
                minLines: 2,
                hints: [
                    "Identifica los 3 casos de la tabla donde la luz L debe encenderse para crear tu ecuación inicial.",
                    "Duplica el término 'ID' por idempotencia para poder factorizar más fácil.",
                    "Factoriza la 'D' en un grupo y la 'I' en el otro, y simplifica los paréntesis a 1."
                ]
            },
            {
                id: 5,
                title: "Problema 5: Sistema Dual (Salida D)",
                description: "En un sistema con tres entradas (T, C y P), tienes dos respuestas diferentes. Para este ejercicio, diseña y simplifica la lógica ÚNICAMENTE para la salida D basándote en tu tabla de verdad.",
                inputs: ["T", "C", "P"],
                output: "D",
                correctTable: [0, 0, 0, 0, 0, 1, 1, 1], 
                solutionSteps: "D = T C' P + T C P' + T C P\nD = T C' P + T C P + T C P' + T C P\nD = T P(C' + C) + T C(P' + P)\nD = T P(1) + T C(1)\nD = T P + T C\nD = T(P + C)",
                finalExpression: "D = T(P + C)",
                acceptableFinals: ["d=t(p+c)", "d=t(c+p)", "t(p+c)", "t(c+p)", "d=tp+tc", "tp+tc", "tc+tp"],
                minLines: 2,
                hints: [
                    "Identifica en tu tabla las filas donde D=1 (filas 101, 110, 111) para sumar tus 3 minitérminos iniciales.",
                    "Aplica Idempotencia para duplicar 'TCP' y así tener 4 términos para agrupar en pares.",
                    "Factoriza 'TP' de un grupo y 'TC' del otro. Al final, vuelve a factorizar extrayendo la 'T' como factor común."
                ]
            },
            {
                id: 6,
                title: "Problema 6: Sistema Dual (Salida A)",
                description: "Continuando con el sistema anterior (entradas T, C y P), ahora evalúa y simplifica la lógica para la segunda salida, A, basándote en tu tabla.",
                inputs: ["T", "C", "P"],
                output: "A",
                correctTable: [0, 1, 1, 1, 0, 0, 0, 0], 
                solutionSteps: "A = T' C' P + T' C P' + T' C P\nA = T' C' P + T' C P + T' C P' + T' C P\nA = T' P(C' + C) + T' C(P' + P)\nA = T' P(1) + T' C(1)\nA = T' P + T' C\nA = T'(P + C)",
                finalExpression: "A = T'(P + C)",
                acceptableFinals: ["a=t'(p+c)", "a=t'(c+p)", "t'(p+c)", "t'(c+p)", "a=t'p+t'c", "t'p+t'c", "t'c+t'p"],
                minLines: 2,
                hints: [
                    "Revisa la tabla: extrae los 3 minitérminos donde A=1 (filas 001, 010, 011).",
                    "Duplica el término 'T'CP' con Idempotencia para que tengas 4 términos fáciles de agrupar.",
                    "Factoriza 'T'P' en el primer par y 'T'C' en el segundo. Luego, extrae 'T'' de ambos para tu resultado final."
                ]
            }
        ,

    {
        title: "Problema 6: Robot seguidor de línea",
        description: "Un robot utiliza tres sensores digitales (I: izquierdo, C: central, D: derecho). Un valor 1 significa que detecta la línea. La salida M permite continuar avanzando y se activa cuando SOLAMENTE el sensor central detecta la línea o cuando LOS TRES sensores la detectan simultáneamente.",
        inputs: ['I', 'C', 'D'],
        output: 'M',
        correctTable: [0, 0, 1, 0, 0, 0, 0, 1],
        minLines: 2,
        hints: [
            "Identifica las combinaciones (I,C,D) que encienden M. Solo el central significa 010. Los tres significa 111.",
            "Los minitérminos son I'CD' y ICD.",
            "Puedes factorizar C para obtener la expresión simplificada."
        ],
        acceptableFinals: ["c(i'd'+id)", "i'cd'+icd", "c(id+i'd')", "(i'd'+id)c", "(id+i'd')c"]
    },
    {
        title: "Problema 7: Detector de números binarios",
        description: "Un circuito recibe un número binario de 4 bits (A, B, C, D) donde A es el bit más significativo y D el menos significativo. Representan decimales entre 0 y 15. La salida S deberá activarse cuando el número ingresado sea MAYOR que 5 y MENOR O IGUAL que 12.",
        inputs: ['A', 'B', 'C', 'D'],
        output: 'S',
        correctTable: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        minLines: 2,
        hints: [
            "Escribe los números decimales del 6 al 12 y conviértelos a binario para identificar las filas con 1.",
            "Usa un mapa de Karnaugh para agrupar los unos. Obtendrás un grupo de cuatro y dos grupos de dos.",
            "El grupo de cuatro abarca 8, 9, 10 y 11."
        ],
        acceptableFinals: ["ab'+a'bc+ac'd'", "a'bc+ab'+ac'd'", "ac'd'+ab'+a'bc", "ab'+ac'd'+a'bc"]
    },
    {
        title: "Problema 8: Detección de números pares",
        description: "Un circuito digital recibe mediante las entradas A, B, C y D un número binario de 4 bits (A es MSB). La salida P se activa cuando el número ingresado es PAR y DIFERENTE DE CERO.",
        inputs: ['A', 'B', 'C', 'D'],
        output: 'P',
        correctTable: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        minLines: 2,
        hints: [
            "Todos los números pares terminan en D=0.",
            "El cero es 0000, por lo que la condición 'diferente de cero' descarta esta fila.",
            "Puedes factorizar D' para simplificar la expresión a una forma muy elegante."
        ],
        acceptableFinals: ["d'(a+b+c)", "(a+b+c)d'", "ad'+bd'+cd'"]
    },
    {
        title: "Problema 9: Bloqueo de seguridad industrial",
        description: "Un robot industrial posee cuatro sensores: P (presencia humana), E (emergencia), T (temperatura), S (puerta abierta). La salida B bloquea el robot si se presiona la emergencia (E) o cuando hay presencia humana (P) MIENTRAS la puerta (S) está abierta.",
        inputs: ['P', 'E', 'T', 'S'],
        output: 'B',
        correctTable: [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        minLines: 1,
        hints: [
            "Este problema puede resolverse directamente por lógica descriptiva sin tabla.",
            "La emergencia E bloquea el robot de inmediato (E=1).",
            "La combinación de persona (P) y puerta abierta (S) es otra condición (PS)."
        ],
        acceptableFinals: ["e+ps", "ps+e"]
    },
    {
        title: "Problema 10: Diagnóstico de hardware",
        description: "Un sistema diagnostica 4 componentes (M, P, D, F). El valor 1 significa que funciona bien. La salida de ERROR (E) se activa cuando DOS O MÁS componentes presentan fallas (tienen valor 0).",
        inputs: ['M', 'P', 'D', 'F'],
        output: 'E',
        correctTable: [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0],
        minLines: 2,
        hints: [
            "Falla significa que la entrada es 0. Dos fallas significa dos ceros.",
            "Las combinaciones con dos o más ceros activan el ERROR.",
            "Puedes usar un mapa de Karnaugh para simplificar, obtendrás 6 grupos de dos unos."
        ],
        acceptableFinals: ["m'p'+m'd'+m'f'+p'd'+p'f'+d'f'"]
    }
];
