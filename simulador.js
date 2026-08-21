/* CONSTANTES (DA PARA MUDAR SE QUISER, MAS O MELHOR É ESSES) */

const FORCA_MIN = 1;
const FORCA_MAX = 50;

const DISTANCIA_MIN = 0.5;
const DISTANCIA_MAX = 3;

const ANGULO_MIN = -20;
const ANGULO_MAX = 20;

const SENSIBILIDADE = 0.6;


/* ELEMENTOS */

const sistemaGangorra =
    document.getElementById("sistemaGangorra");

const pesoEsquerdo =
    document.getElementById("pesoEsquerdo");

const pesoDireito =
    document.getElementById("pesoDireito");

const linhaDistanciaEsquerda =
    document.getElementById("linhaDistanciaEsquerda");

const linhaDistanciaDireita =
    document.getElementById("linhaDistanciaDireita");

const textoDistanciaEsquerda =
    linhaDistanciaEsquerda.querySelector("span");

const textoDistanciaDireita =
    linhaDistanciaDireita.querySelector("span");

const mensagem =
    document.getElementById("mensagem");


/* INPUTS */

const inputForcaEsquerda =
    document.getElementById("forcaEsquerdaInput");

const inputForcaDireita =
    document.getElementById("forcaDireitaInput");

const inputDistanciaEsquerda =
    document.getElementById("distanciaEsquerdaInput");

const inputDistanciaDireita =
    document.getElementById("distanciaDireitaInput");


/* VALORES (VALORES INICIAIS, DA PARA MUDAR TAMBEM) */

let forcaEsquerda = 10;
let forcaDireita = 10;

let distanciaEsquerda = 1;
let distanciaDireita = 1;

let anguloAtual = 0;

let arrastando = null;


/* INICIALIZAÇÃO */

atualizar();


/* EVENTOS DOS INPUTS (AS CAIXAS QUE VOCÊ CONSEGUE ESCREVER OS VALORES) */

inputForcaEsquerda.addEventListener(
    "input",
    atualizarPorInput
);

inputForcaDireita.addEventListener(
    "input",
    atualizarPorInput
);

inputDistanciaEsquerda.addEventListener(
    "input",
    atualizarPorInput
);

inputDistanciaDireita.addEventListener(
    "input",
    atualizarPorInput
);


/* LER INPUTS */

function atualizarPorInput() {

    const fe =
        Number(inputForcaEsquerda.value);

    const fd =
        Number(inputForcaDireita.value);

    const de =
        Number(inputDistanciaEsquerda.value);

    const dd =
        Number(inputDistanciaDireita.value);


    if (
        !Number.isFinite(fe) ||
        !Number.isFinite(fd) ||
        !Number.isFinite(de) ||
        !Number.isFinite(dd)
    ) {
        return;
    }


    if (
        fe < FORCA_MIN ||
        fe > FORCA_MAX ||
        fd < FORCA_MIN ||
        fd > FORCA_MAX
    ) {

        mostrarMensagem(
            "A força deve estar entre 1 N e 50 N."
        );

        return;
    }


    if (
        de < DISTANCIA_MIN ||
        de > DISTANCIA_MAX ||
        dd < DISTANCIA_MIN ||
        dd > DISTANCIA_MAX
    ) {

        mostrarMensagem(
            "A distância deve estar entre 0,5 m e 3 m."
        );

        return;
    }


    limparMensagem();

    forcaEsquerda = fe;
    forcaDireita = fd;

    distanciaEsquerda = de;
    distanciaDireita = dd;

    atualizar();
}


/* TORQUE (JA CONSIDERANDO SEN(X) COMO 1, OU SEJA, X = 90) */

function calcularTorqueEsquerdo() {

    return (
        forcaEsquerda *
        distanciaEsquerda
    );
}


function calcularTorqueDireito() {

    return (
        forcaDireita *
        distanciaDireita
    );
}


/* ÂNGULO (ANGULO QUE A GANGORRA VAI GIRAR) */

function calcularAngulo() {

    const torqueE =
        calcularTorqueEsquerdo();

    const torqueD =
        calcularTorqueDireito();

    return (
        (torqueD - torqueE) *
        SENSIBILIDADE
    );
}


/* ATUALIZAÇÃO */

function atualizar() {

    anguloAtual =
        calcularAngulo();

    anguloAtual =
        limitar(
            anguloAtual,
            ANGULO_MIN,
            ANGULO_MAX
        );


    sistemaGangorra.style.transform =
        `translate(-50%, -50%) rotate(${anguloAtual}deg)`;


    atualizarPesos();
    atualizarDistancias();
    atualizarInformacoes();
}


/* POSIÇÃO DOS PESOS */

function atualizarPesos() {

    const esquerda =
        50 -
        (
            distanciaEsquerda /
            DISTANCIA_MAX
        ) *
        40;


    const direita =
        50 +
        (
            distanciaDireita /
            DISTANCIA_MAX
        ) *
        40;


    pesoEsquerdo.style.left =
        esquerda + "%";

    pesoDireito.style.left =
        direita + "%";
}


/* LINHAS D1 E D2 */

function atualizarDistancias() {

    const esquerda =
        50 -
        (
            distanciaEsquerda /
            DISTANCIA_MAX
        ) * 40;


    const direita =
        50 +
        (
            distanciaDireita /
            DISTANCIA_MAX
        ) * 40;


    linhaDistanciaEsquerda.style.left =
        esquerda + "%";

    linhaDistanciaEsquerda.style.width =
        (50 - esquerda) + "%";


    linhaDistanciaDireita.style.left =
        "50%";

    linhaDistanciaDireita.style.width =
        (direita - 50) + "%";
}


/* INFORMAÇÕES */

function atualizarInformacoes() {

    const torqueE =
        calcularTorqueEsquerdo();

    const torqueD =
        calcularTorqueDireito();


    document.getElementById(
        "torqueEsquerdo"
    ).textContent =
        formatar(torqueE) + " N·m";


    document.getElementById(
        "torqueDireito"
    ).textContent =
        formatar(torqueD) + " N·m";


    document.getElementById(
        "angulo"
    ).textContent =
        formatar(anguloAtual) + "°";


    /* TEXTOS DAS DISTÂNCIAS (ativado, mas da para desativar) */

    textoDistanciaEsquerda.textContent =
        `d1 = ${formatar(distanciaEsquerda)} m`;

    textoDistanciaDireita.textContent =
        `d2 = ${formatar(distanciaDireita)} m`;


    /* TEXTOS DOS BLOCOS (desativado, mas da para ativar) */

    /*pesoEsquerdo.textContent =
        formatar(forcaEsquerda) + " N";

    pesoDireito.textContent =
        formatar(forcaDireita) + " N";
    */

    atualizarEstado(
        torqueE,
        torqueD
    );
}


/* ESTADO */

function atualizarEstado(
    torqueE,
    torqueD
) {

    const elemento =
        document.getElementById("equilibrio");


    const diferenca =
        torqueE - torqueD;


    if (
        Math.abs(diferenca) < 0.05
    ) {

        elemento.textContent =
            "⚖️ EQUILÍBRIO — os dois torques são iguais.";

        elemento.style.background =
            "#dcfce7";

        elemento.style.color =
            "#166534";

        return;
    }


    if (diferenca > 0) {

        elemento.textContent =
            "⬇️ O lado esquerdo possui maior torque.";

        elemento.style.background =
            "#eff6ff";

        elemento.style.color =
            "#1d4ed8";

        return;
    }


    elemento.textContent =
        "⬇️ O lado direito possui maior torque.";

    elemento.style.background =
        "#fff1f2";

    elemento.style.color =
        "#b91c1c";
}


/* ARRASTAR AZUL */

pesoEsquerdo.addEventListener(
    "pointerdown",
    function(event) {

        arrastando = "esquerdo";

        pesoEsquerdo.setPointerCapture(
            event.pointerId
        );

        event.preventDefault();
    }
);


/* ARRASTAR VERMELHO */

pesoDireito.addEventListener(
    "pointerdown",
    function(event) {

        arrastando = "direito";

        pesoDireito.setPointerCapture(
            event.pointerId
        );

        event.preventDefault();
    }
);


/* MOVIMENTO */

document.addEventListener(
    "pointermove",
    function(event) {

        if (!arrastando) {
            return;
        }


        const rect =
            sistemaGangorra.getBoundingClientRect();


        const centroX =
            rect.left +
            rect.width / 2;

        const centroY =
            rect.top +
            rect.height / 2;


        const dx =
            event.clientX -
            centroX;

        const dy =
            event.clientY -
            centroY;


        const rad =
            anguloAtual *
            Math.PI /
            180;


        const eixoX =
            Math.cos(rad);

        const eixoY =
            Math.sin(rad);


        const posicao =
            dx * eixoX +
            dy * eixoY;


        const meio =
            rect.width / 2;


        let distancia =
            Math.abs(posicao) /
            meio *
            DISTANCIA_MAX;


        distancia =
            limitar(
                distancia,
                DISTANCIA_MIN,
                DISTANCIA_MAX
            );


        /* AZUL */

        if (
            arrastando === "esquerdo"
        ) {

            if (posicao >= 0) {
                return;
            }


            const torqueNovo =
                forcaEsquerda *
                distancia;


            const torqueDireito =
                calcularTorqueDireito();


            const novoAngulo =
                (
                    torqueDireito -
                    torqueNovo
                ) *
                SENSIBILIDADE;


            if (
                novoAngulo >= ANGULO_MIN &&
                novoAngulo <= ANGULO_MAX
            ) {

                distanciaEsquerda =
                    distancia;

                inputDistanciaEsquerda.value =
                    distancia.toFixed(2);

                atualizar();
            }
        }


        /* VERMELHO */

        if (
            arrastando === "direito"
        ) {

            if (posicao <= 0) {
                return;
            }


            const torqueEsquerdo =
                calcularTorqueEsquerdo();


            const torqueNovo =
                forcaDireita *
                distancia;


            const novoAngulo =
                (
                    torqueNovo -
                    torqueEsquerdo
                ) *
                SENSIBILIDADE;


            if (
                novoAngulo >= ANGULO_MIN &&
                novoAngulo <= ANGULO_MAX
            ) {

                distanciaDireita =
                    distancia;

                inputDistanciaDireita.value =
                    distancia.toFixed(2);

                atualizar();
            }
        }

    }
);


/* PARAR DE ARRASTAR */

document.addEventListener(
    "pointerup",
    function() {

        arrastando = null;

    }
);


document.addEventListener(
    "pointercancel",
    function() {

        arrastando = null;

    }
);


/* AUXILIARES */

function limitar(
    valor,
    minimo,
    maximo
) {

    return Math.max(
        minimo,
        Math.min(
            maximo,
            valor
        )
    );
}


function formatar(numero) {

    return numero
        .toFixed(2)
        .replace(".", ",");
}


function mostrarMensagem(texto) {

    mensagem.innerHTML =
        texto;

    mensagem.classList.add(
        "visivel"
    );
}


function limparMensagem() {

    mensagem.innerHTML =
        "";

    mensagem.classList.remove(
        "visivel"
    );
}