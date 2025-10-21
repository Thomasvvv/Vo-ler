"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, SkipForward, Volume2 } from "lucide-react" 
import Link from "next/link"

// Define o tempo que o vídeo deve continuar rodando após a última pergunta (30s)
const VIDEO_END_TIME = 35; 

export default function AvaliacaoInicial() {
  const [etapa, setEtapa] = useState<"video" | "verificacao-nome" | "resultado">("video")
  const [respostas, setRespostas] = useState<boolean[]>([])
  const [perguntaAtual, setPerguntaAtual] = useState(0) // 0-4 é o índice da pergunta. 5 indica que todas foram respondidas.
  const [videoPausado, setVideoPausado] = useState(false)
  const [videoIniciado, setVideoIniciado] = useState(false)
  const [nomeDigitado, setNomeDigitado] = useState("")
  // NOVO ESTADO para controlar o fade dos botões
  const [showControls, setShowControls] = useState(false) 
  const [mostrarBotaoVerde, setMostrarBotaoVerde] = useState(false)
  const [mostrarBotaoVermelho, setMostrarBotaoVermelho] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // TEMPOS DE PAUSA MANTIDOS
  const temposPausa = [17, 21, 25, 27, 30]

  // NOVAS PERGUNTAS (P2 é sobre saber escrever o nome)
  const perguntas = [
    "Pergunta 1: Você conhece o alfabeto de A a Z?",
    "Pergunta 2: Você sabe escrever seu nome sem olhar em lugar nenhum?",
    "Pergunta 3: Você sabe o som que essas letras juntas fazem?",
    "Pergunta 4: E essas aqui?",
    "Pergunta 5: E se juntarmos todas elas?",
  ]

  const iniciarVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setVideoIniciado(true)
        })
        .catch((error) => {
          console.log("[v0] Erro ao iniciar vídeo:", error)
          alert("Não foi possível iniciar o vídeo. Por favor, tente novamente.")
        })
    }
  }


  // LÓGICA DE TRANSIÇÃO APÓS O FIM DO VÍDEO
  const handleVideoEnd = () => {
    if (etapa === "video") {
      const sabeEscreverNome = respostas[1]

      if (sabeEscreverNome) {
        setEtapa("verificacao-nome")
      } else {
        setEtapa("resultado")
      }
    }
  }

  useEffect(() => {
    if (etapa === "video" && videoRef.current && videoIniciado) {
      const video = videoRef.current

      const handleTimeUpdate = () => {
        const tempoAtual = video.currentTime
         if (tempoAtual >= 10 && !mostrarBotaoVerde && !videoPausado) {
          setMostrarBotaoVerde(true)
        }

        // Mostrar botão vermelho aos 13 segundos com fade
        if (tempoAtual >= 13 && !mostrarBotaoVermelho && !videoPausado) {
          setMostrarBotaoVermelho(true)
        }
        // 1. Lógica de pausa para as 5 perguntas (perguntaAtual: 0 a 4)
        if (perguntaAtual < temposPausa.length) {
          const tempoPergunta = temposPausa[perguntaAtual]
          if (tempoPergunta && tempoAtual >= tempoPergunta && !videoPausado) {
            video.pause()
            setVideoPausado(true)
            // INICIA O FADE IN
            setTimeout(() => setShowControls(true), 50); 
          }
        } 
        
        // 2. Lógica de fim de vídeo (depois que todas as perguntas foram respondidas, perguntaAtual: 5)
        if (perguntaAtual === temposPausa.length && tempoAtual >= VIDEO_END_TIME) {
            video.pause()
            handleVideoEnd()
        }
      }
      
      const handleVideoEnded = () => {
        if (perguntaAtual === temposPausa.length) {
            handleVideoEnd();
        }
      }

      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("ended", handleVideoEnded)
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("ended", handleVideoEnded)
      }
    }
  }, [etapa, perguntaAtual, videoPausado, temposPausa, videoIniciado, respostas]) 

  // LÓGICA DE RESPOSTA ATUALIZADA
  const responder = (resposta: boolean) => {
    const novasRespostas = [...respostas, resposta]
    setRespostas(novasRespostas)
    
    // INICIA O FADE OUT DOS BOTÕES
    setShowControls(false);

    // Espera a transição de fade (300ms) antes de liberar a pausa do vídeo
    setTimeout(() => {
        setVideoPausado(false);

        // Se ainda há perguntas a serem feitas (P1 a P4, índices 0 a 3)
        if (perguntaAtual < temposPausa.length - 1) {
            setPerguntaAtual(perguntaAtual + 1);
            videoRef.current?.play();
        } else {
            // Última pergunta respondida (P5, índice 4).
            // Avança o contador para '5' para que o useEffect continue a reprodução até o VIDEO_END_TIME
            setPerguntaAtual(temposPausa.length); // Define perguntaAtual como 5
            videoRef.current?.play(); 
        }
    }, 350); // 350ms para garantir que a animação de 300ms seja concluída
  }


  const pularVideo = () => {
    window.location.href = "/alfabeto"
  }

  // LÓGICA DE ROTA MANTIDA
  const calcularProximaRota = () => {
    const [p1_alfabeto, p2_nome, p3_som1, p4_som2, p5_somFinal] = respostas

    if (p1_alfabeto && p3_som1 && p4_som2 && p5_somFinal) {
      return {
        titulo: "Domínio Excelente!",
        descricao: "Seu conhecimento fonético e do alfabeto é forte! Iremos focar em textos, leitura e escrita avançada.",
        proximaRota: "/leitura", 
      }
    }

    if (p1_alfabeto) {
      return {
        titulo: "Pronto para Palavras!",
        descricao: "Você conhece o alfabeto! Vamos começar imediatamente com a formação de sílabas e leitura de palavras simples.",
        proximaRota: "/leitura", 
      }
    }

    return {
      titulo: "Vamos começar do início!",
      descricao: "Você vai aprender o alfabeto, o som das letras e sílabas com atividades práticas e divertidas.",
      proximaRota: "/alfabeto", 
    }
  }

  // LÓGICA DE VERIFICAR NOME SIMPLIFICADA
  const verificarNome = () => {
    if (nomeDigitado.trim().length >= 2) {
      localStorage.setItem("nomeAluno", nomeDigitado.trim())
      setEtapa("resultado")
    } else {
      alert("Por favor, digite seu nome completo")
    }
  }

  // === RENDERIZAÇÃO DE VERIFICAÇÃO DE NOME (APÓS O VÍDEO) ===

  if (etapa === "verificacao-nome") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl bg-white/95 backdrop-blur">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-balance">
                Desafio Final: Escreva Seu Nome!
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 text-balance">
                Você respondeu que sabe escrever. Vamos confirmar para personalizar seu aprendizado:
              </p>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                value={nomeDigitado}
                onChange={(e) => setNomeDigitado(e.target.value)}
                placeholder="Digite seu nome aqui..."
                className="w-full px-8 py-8 text-3xl md:text-4xl font-bold text-center border-4 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all bg-white"
                autoFocus
              />

              <Button
                onClick={verificarNome}
                size="lg"
                className="w-full py-10 text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
              >
                <Check className="w-10 h-10 mr-3" />
                Confirmar e Ver Resultado
              </Button>

              <Button
                onClick={() => {
                  const respostasAjustadas = [...respostas]
                  respostasAjustadas[1] = false 
                  setRespostas(respostasAjustadas)
                  setEtapa("resultado")
                }}
                variant="outline"
                size="lg"
                className="w-full py-8 text-xl font-semibold border-2 border-gray-300 hover:bg-gray-100"
              >
                Na verdade, ainda preciso praticar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // === RENDERIZAÇÃO DE VÍDEO ===

  if (etapa === "video") {
    const progresso = ((perguntaAtual) / temposPausa.length) * 100 

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        <Card className="w-full max-w-5xl p-6 md:p-10 shadow-2xl bg-white/95 backdrop-blur">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-purple-700">
                    {perguntaAtual < temposPausa.length ? 
                      `Pergunta ${perguntaAtual + 1} de ${temposPausa.length}` : 
                      "Avaliação Concluída"}
                  </span>
                  <span className="text-xl font-semibold text-blue-600">{Math.round(progresso)}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>
              <Button
                onClick={pularVideo}
                variant="outline"
                size="lg"
                className="ml-6 px-6 py-6 text-lg font-semibold border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-colors bg-white"
              >
                <SkipForward className="w-6 h-6 mr-2" />
                Pular Avaliação
              </Button>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden aspect-video relative shadow-xl">
              <video ref={videoRef} className="w-full h-full object-cover" controls={false} playsInline muted={false}>
                <source src="/video-avaliacao.mp4" type="video/mp4" />
                <source src="/video-avaliacao.webm" type="video/webm" />
                <source src="/video-avaliacao.mov" type="video/quicktime" />

                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 text-blue-400 text-4xl">▶</div>
                    </div>
                    <p className="text-white text-xl font-semibold">Vídeo de Avaliação</p>
                    <p className="text-white/70 text-sm max-w-md">
                      O vídeo pausará automaticamente após cada pergunta para você responder
                    </p>
                  </div>
                </div>
              </video>

              {!videoIniciado && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <Button
                    onClick={iniciarVideo}
                    size="lg"
                    className="px-16 py-12 text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all animate-pulse"
                  >
                    <Volume2 className="size-10 mr-4" />
                    INICIAR AVALIAÇÃO
                  </Button>
                </div>
              )}
            </div>

            {/* APLICAÇÃO DO EFEITO FADE: Usando showControls e videoPausado */}
            {videoPausado && (
              <div 
                className={`space-y-4 transition-opacity duration-300 ease-in-out ${showControls ? 'opacity-100' : 'opacity-0'}`}
              >
                <p className="text-center text-xl md:text-2xl font-semibold text-gray-800 text-balance">
                  {perguntas[perguntaAtual]}
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <Button
                    onClick={() => responder(true)}
                    size="lg"
                    className="py-12 text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg group transform hover:scale-105 transition-all"
                  >
                    <Check className="size-12 mr-4 group-hover:scale-110 transition-transform" />
                    SIM
                  </Button>
                  <Button
                    onClick={() => responder(false)}
                    size="lg"
                    className="py-12 text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-2xl shadow-lg group transform hover:scale-105 transition-all"
                  >
                    <X className="size-12 mr-4 group-hover:scale-110 transition-transform" />
                    NÃO
                  </Button>
                </div>
              </div>
            )}

            {!videoPausado && videoIniciado && (
              <div className="text-center">
                <p className="text-xl text-purple-700 animate-pulse font-semibold">
                  {perguntaAtual < temposPausa.length ? 
                    "Assista com atenção..." : 
                    "Avaliação concluída! Aguarde o redirecionamento..."
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  // === RENDERIZAÇÃO DE RESULTADO FINAL ===

  const resultado = calcularProximaRota()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl bg-white/95 backdrop-blur">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-balance">
              {resultado.titulo}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 text-balance">{resultado.descricao}</p>
          </div>

          <Link href={resultado.proximaRota}>
            <Button
              size="lg"
              className="w-full md:w-auto px-12 py-8 text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
            >
              Começar a Aprender
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}