let estadoHorno = 'apagado', videoHornoActual, puertaHorno, puertaBloqueada = false;

window.onload = () => {
    videoHornoActual = document.getElementById('video-horno');
    puertaHorno = document.getElementById('puerta-horno');
    puertaHorno.onclick = () => {
        if (!puertaBloqueada) {

            if (estadoHorno == 'tarta-lista') {
                estadoHorno = 'retirar-lista';
            } else if (estadoHorno == 'tarta-quemada') {
                estadoHorno = 'retirar-quemada'
            }
            avanzarAnimacion();
        }
    }

    function avanzarAnimacion() {
        switch (estadoHorno) {
            case 'apagado':
                bloquearPuerta(true);
                reproducirSonido('puerta', false);
                mostrarVideo();
                reproducirVideo('horno-abriendo-puerta')
                cuandoTerminaAvanzarA('cocinando');
                break;
            case 'cocinando':
                reproducirVideo('horno-cocinando');
                reproducirSonido('timer', true);

                cuandoTerminaAvanzarA('tarta-lista');
                break;
            case 'tarta-lista':
                //pausar sonido con funcion
                detenerSonido();
                //bloquear la puerta
                bloquearPuerta(false);

                //reproducir video de la tarta lista
                reproducirVideo('horno-tarta-lista');
                //reproducir sonido de campanita, con prametro false para que no loopee
                reproducirSonido('campanita', false);

                //cambio de estado a tarta quemandose 
                cuandoTerminaAvanzarA('tarta-quemandose');
                break;
            case 'tarta-quemandose':
                //frenar sonidos
                detenerSonido();
                //bloquear puerta nuevamente
                bloquearPuerta(true);
                reproducirVideo('horno-tarta-quemandose');
                cuandoTerminaAvanzarA('tarta-quemada');

                break;
            case 'tarta-quemada':
                bloquearPuerta(false);
                reproducirVideo('horno-tarta-quemada');
                loopear();

            case 'retirar-lista':
                //reproducir sonido de puerta abriendose 
                reproducirSonido('puerta-con-tarta', false);
                //bloquear puerta para evitar que salte la animaion
                bloquearPuerta(true);
                //reproducir video sacando la tarta
                reproducirVideo('horno-retirar-lista');
                //reiniciar estados
                reiniciar();
                break;
            case 'retirar-quemada':
                reproducirSonido('puerta-con-tarta', false);
                bloquearPuerta(true);
                reproducirVideo('horno-retirar-quemada');
                reiniciar();
        }



    }

    let sonido;
    function reproducirSonido(nombreSonido, loopearSonido) {
        sonido = new Audio(`sound/${nombreSonido}.mp3`); //crea un nuevo objeto de sonido con el nombre que le pasemos por parametro
        sonido.play();
        sonido.loop = loopearSonido; //true o false
    }
    function mostrarVideo() {
        videoHornoActual.classList.remove("hidden");
    }
    function ocultarVideo() {
        videoHornoActual.classList.add("hidden");
    }
    function reproducirVideo(nombreVideo) {
        videoHornoActual.src = `video/${nombreVideo}.webm` //cambia el src por el video que le pasemos
        videoHornoActual.play();
    }
    function actualizarEstadoA(estadoNuevo) {
        estadoHorno = estadoNuevo;
    }
    function cuandoTerminaAvanzarA(estadoNuevo) {
        videoHornoActual.onended = () => {
            //cuando el video termine ejecute lo siguiente:
            actualizarEstadoA(estadoNuevo)
            avanzarAnimacion();
        }
    }
    function bloquearPuerta(traba) {
        puertaBloqueada = traba;
    }
    function detenerSonido() {
        sonido.pause();
    }
    function loopear(tiempo) {
        videoHornoActual.loop = true;
        if (time != undefined) {
            setTimeout(() => {
                desloopear();
            }, time);
        }
    }

    function desloopear() {
        videoHornoActual.loop = false;
    }
    function reiniciar() {
        desloopear();
        videoHornoActual.onended = () => {
            actualizarEstadoA('apagado');
            ocultarVideo();
            bloquearPuerta(false);
            rotarPerilla(0);
        }
    }
    const MAX_PLAYBACK_RATE = 16, MIN_PLAYBACK_RATE = 1;
    let perillaHorno = document.getElementById('perilla-horno'), rotacionPerilla = 0;
    //detectar cuando el mouse esta sobre la perilla y se gira la rueda
    perillaHorno.onmousewheel = (data) => {
        console.log(data);
        //acelerar y desacelerar los videos segun la direccion
        if (estadoHorno == 'cocinando' || estadoHorno == 'tarta-lista') {
            cambiarTemperatura(data);
        }
        //rotar la perilla en la direccion que corresponda
    }
    function cambiarTemperatura(dataRecibida) {
        if (dataRecibida.deltaY < 0 && videoHornoActual.playbackRate < MAX_PLAYBACK_RATE) {
            rotarPerilla('derecha');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate + 0.5;
        } else if (dataRecibida.deltaY > 0 && videoHornoActual.playbackRate > MIN_PLAYBACK_RATE); {
            rotarPerilla('izquierda');
            videoHornoActual.playbackRate = videoHornoActual.playbackRate - 0.5;
        }
    }
    function rotarPerilla(direccion) {
        if (direccion === 'derecha') {
            rotacionPerilla = rotacionPerilla + 2.5;
        } else if (direccion === 'izquierda') {
            rotacionPerilla = rotacionPerilla - 2.5;
        } else {
            rotacionPerilla = direccion;
        }
        perillaHorno.style.transform = `rotate(${rotacionPerilla}deg)`;
    }
}

