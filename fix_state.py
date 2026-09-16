import re
with open('src/components/LogicLab.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

state_injection = """
            const [procedureMethod, setProcedureMethod] = useState('boole');
            const [kMapGrid, setKMapGrid] = useState([]);
            
            const getKMapDimensions = (numInputs) => {
                const inputs = currentProblem ? currentProblem.inputs : [];
                if (numInputs === 4) return { rows: ['00', '01', '11', '10'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2]+inputs[3], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 3) return { rows: ['0', '1'], cols: ['00', '01', '11', '10'], rowLabels: inputs[2], colLabels: inputs[0]+inputs[1] };
                if (numInputs === 2) return { rows: ['0', '1'], cols: ['0', '1'], rowLabels: inputs[1], colLabels: inputs[0] };
                return null;
            };
"""

content = content.replace('const [userFinal, setUserFinal] = useState("");', state_injection.strip() + '\n            const [userFinal, setUserFinal] = useState("");')

with open('src/components/LogicLab.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
