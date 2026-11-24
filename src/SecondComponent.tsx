import { useState } from "react";

interface SecondComponentProps{
    qtdeAlunos: number,
    qtdeVagas: number
}

const SecondComponent = ({qtdeAlunos, qtdeVagas}:SecondComponentProps) => {
    const data = {
        curso: null,
        disciplina: "Frameworks Web"
    }

    function clicar(){
        alert("Botão Clicado!");
    }

    const [contador, setContador] = useState(0);

    function contar(){
        setContador(contador+1);
        console.log(contador);
    }

    return(
        <div>
            <h2>Segundo Componente</h2>
            <p>Curso: {data.curso ?? "Sem conteúdo"}</p>
            <p>Disciplina: {data.disciplina}</p>
            <p>Quantidade de Alunos: {qtdeAlunos}</p>
            <p>Quantidade de Vagas: {qtdeVagas}</p>
            <p>Valor Contador: {contador}</p>
            <button onClick={clicar}>Clicar</button>
            <button onClick={contar}>Add</button>
        </div>
    );
}

export default SecondComponent;