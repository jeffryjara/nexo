import re

with open('src/data/problems.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_problems = """
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
"""

# Insert the new problems into the array before the last `];`
# Assuming the file ends with `];` or `export default todosLosProblemas;`
content = content.replace("];", ",\n" + new_problems.strip()[1:-1] + "\n];")

with open('src/data/problems.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added problems 6 to 10.")
