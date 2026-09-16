// EVALUADOR ESTRICTO DE ÁLGEBRA DE BOOLE
export function evaluarBooleano(expr, inputs, values) {
    let str = expr.toUpperCase().replace(/\s+/g, '');
    if (str.includes('=')) {
        str = str.split('=')[1];
    }
    
    if (/[2-9]/.test(str)) return { error: 'uso de números inválidos (en álgebra de Boole solo existen 0 y 1)' };
    
    const allowedVars = inputs.map(i => i.toUpperCase());
    const letters = str.match(/[A-Z]/g) || [];
    for (let l of letters) {
        if (!allowedVars.includes(l)) {
            return { error: `uso de variable no permitida '${l}'. Solo usa las entradas del problema` };
        }
    }

    str = str.replace(/([A-Z0-9])'/g, '(!$1)');
    for(let i=0; i<3; i++){
        str = str.replace(/([A-Z0-9\)])([A-Z\(])/g, '$1*$2'); 
    }
    str = str.replace(/\+/g, '||').replace(/\*/g, '&&').replace(/·/g, '&&');
    
    inputs.forEach((inp, idx) => {
        const val = values[idx] === 1 ? 'true' : 'false';
        const regex = new RegExp(inp, 'g');
        str = str.replace(regex, val);
    });
    str = str.replace(/0/g, 'false').replace(/1/g, 'true');

    try {
        return { result: new Function('return ' + str)() ? 1 : 0 };
    } catch (e) {
        return { error: 'sintaxis matemática malformada' };
    }
}

// CALCULADOR DE COMPLEJIDAD
export function countVariables(expr, inputs) {
    let str = expr.toUpperCase().replace(/\s+/g, '');
    if (str.includes('=')) str = str.split('=')[1];
    let count = 0;
    const allowedVars = inputs.map(i => i.toUpperCase());
    for (let char of str) {
        if (allowedVars.includes(char)) count++;
    }
    return count;
}
