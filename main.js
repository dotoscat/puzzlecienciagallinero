// MIT License

// Copyright (c) 2020 Oscar Triano García

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

"use strict";

const IZQUIERDA = -1;
const DERECHA = 1;

let numeroGallinas = 100;
let numeroVeces = 1;
let resultadosSimulaciones = null;

function Gallina() {
    this.picada = 0;
    this.direccionPica = 0;
}

Gallina.prototype.pica = function() {
    this.direccionPica = Math.random() <= 0.5 ? IZQUIERDA : DERECHA;
    return this.direccionPica; 
}

Gallina.prototype.picar = function() {
    this.picada++;
}

Gallina.prototype.esPicada = function() {
    return this.picada > 0;
}

function contarGallinasSinPicar(gallinero) {
    let gallinas = 0;
    for (let i = 0; i < gallinero.length; i++) {
        if (!gallinero[i].esPicada()){
            gallinas++;
        }
    }
    return gallinas;
}

function gallineroPicar(gallinas) {
    for (let i = 0; i < gallinas.length; i++) {
        const direccion = gallinas[i].pica();
        if (i == 0 && direccion == IZQUIERDA) {
            gallinas[gallinas.length-1].picar();
        }
        else if (i == (gallinas.length - 1) && direccion == DERECHA){
            gallinas[0].picar();
        }
        else {
            gallinas[i+direccion].picar();
        }
    }
}

function actualizar(gallinero){
    const gallineroGrafico = document.getElementById("gallinero");
    for (let i = 0; i < gallinero.length; i++) {
        let contenido = "";
        if (gallinero[i].direccionPica == IZQUIERDA) {
            contenido = `\u2190${gallinero[i].picada}`;
        }
        else if (gallinero[i].direccionPica == DERECHA) {
            contenido = `${gallinero[i].picada}\u2192`;
        }
        gallineroGrafico.children[i].innerText = contenido;
    }
}

function iniciarGallinero(gallinero) {
    for (let i = 0; i < gallinero.length; i++) {
        gallinero[i] = new Gallina();
    }
}

function crearGraficoGallinero(numeroGallinas) {
    const gallinero = document.getElementById("gallinero");
    while(gallinero.firstChild){
        gallinero.removeChild(gallinero.firstChild);
    }
    for (let i = 0; i < numeroGallinas; i++) {
        const gallina = document.createElement("span");
        gallina.innerText = "0";
        gallinero.appendChild(gallina);
    }
}

function onclickSimular() {
    numeroGallinas = +document.getElementById("numerogallinas").value;
    const minNumeroGallinas = +document.getElementById("numerogallinas").min;
    numeroVeces = +document.getElementById("numeroveces").value;
    if (numeroGallinas < minNumeroGallinas){
        alert(`Escriba un número de gallinas superior o igual a ${minNumeroGallinas}`);
        return;
    }
    if (numeroVeces <= 0){
        alert("Escriba un número de veces superior a 0");
        return;
    }
    resultadosSimulaciones = new Array(numeroVeces);

    let totalGallinasSinPicar = 0;
    let minimo = numeroGallinas;
    let maximo = 0;

    for(let i = 0; i < numeroVeces; i++){
        resultadosSimulaciones[i] = new Array(numeroGallinas);
        const gallinero = resultadosSimulaciones[i];
        iniciarGallinero(gallinero);
        gallineroPicar(gallinero);
        const gallinasSinPicar = contarGallinasSinPicar(gallinero);
        totalGallinasSinPicar += gallinasSinPicar;
        if (gallinasSinPicar < minimo) {
            minimo = gallinasSinPicar;
        }
        if (gallinasSinPicar > maximo){
            maximo = gallinasSinPicar;
        }
    }

    const promedio = totalGallinasSinPicar / numeroVeces;

    document.getElementById("minimo").innerText = `Mínimo: ${minimo}`;
    document.getElementById("maximo").innerText = `Máximo: ${maximo}`;
    document.getElementById("promedio").innerText = `Promedio: ${promedio}`;
    const controlIteraciones = document.getElementById("veriteracion");
    controlIteraciones.max = numeroVeces;
    controlIteraciones.value = 1;
    controlIteraciones.readOnly = false;
    document.getElementById("veriteraciontotal").innerText = numeroVeces;
    crearGraficoGallinero(numeroGallinas);
    actualizar(resultadosSimulaciones[0]);
}

function oninputVerIteracion(resultadosSimulaciones) {
    const iteracion = +document.getElementById("veriteracion").value;
    const gallinero = resultadosSimulaciones[iteracion-1];
    actualizar(gallinero);
}
