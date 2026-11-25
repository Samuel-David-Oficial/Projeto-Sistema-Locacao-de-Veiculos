import SecondComponent from "./SecondComponent";

export default function FirstComponent(){
    return(
        <div>
            <h1>Primeiro Componente</h1>
            <SecondComponent qtdeAlunos={50} qtdeVagas={60} />
        </div>
    );
}