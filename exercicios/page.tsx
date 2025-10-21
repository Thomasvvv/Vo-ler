"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight } from "lucide-react"
import Link from "next/link"

const alfabeto = [
  { letra: "A", palavra: "AVIÃO", imagem: "✈️" },
  { letra: "B", palavra: "BOLO", imagem: "🍰" },
  { letra: "C", palavra: "CAFÉ", imagem: "☕" },
  { letra: "D", palavra: "DEDO", imagem: "👆" },
  { letra: "E", palavra: "ESTRELA", imagem: "⭐" },
  { letra: "F", palavra: "FACA", imagem: "🔪" },
  { letra: "G", palavra: "GARFO", imagem: "🍴" },
  { letra: "H", palavra: "HORA", imagem: "⏰" },
  { letra: "I", palavra: "IGREJA", imagem: "⛪" },
  { letra: "J", palavra: "JANELA", imagem: "🪟" },
  { letra: "K", palavra: "KIWI", imagem: "🥝" },
  { letra: "L", palavra: "LUA", imagem: "🌙" },
  { letra: "M", palavra: "MÃO", imagem: "✋" },
  { letra: "N", palavra: "NETO", imagem: "👶" },
  { letra: "O", palavra: "ÓCULOS", imagem: "👓" },
  { letra: "P", palavra: "PALITO", imagem: "🥢" },
  { letra: "Q", palavra: "QUEIJO", imagem: "🧀" },
  { letra: "R", palavra: "REMÉDIO", imagem: "💊" },
  { letra: "S", palavra: "SAPATO", imagem: "👞" },
  { letra: "T", palavra: "TELEFONE", imagem: "📞" },
  { letra: "U", palavra: "UVA", imagem: "🍇" },
  { letra: "V", palavra: "VELA", imagem: "🕯️" },
  { letra: "W", palavra: "WI-FI", imagem: "📶" },
  { letra: "X", palavra: "XALE", imagem: "🧣" },
  { letra: "Y", palavra: "YOGA", imagem: "🧘" },
  { letra: "Z", palavra: "ZEBRA", imagem: "🦓" },
]

export default function ExerciciosAlfabeto() {
  const [exercicioAtual, setExercicioAtual] = useState(0)
  const [opcoes, setOpcoes] = useState<typeof alfabeto>([])
  const [respostaCorreta, setRespostaCorreta] = useState<string>("")
  const [feedback, setFeedback] = useState<"correto" | "incorreto" | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [concluido, setConcluido] = useState(false)
  const [fase, setFase] = useState<"normal" | "avancado">("normal")
  const [letrasUsadas, setLetrasUsadas] = useState<Set<string>>(new Set())

  const totalExercicios = 10

  useEffect(() => {
    gerarNovoExercicio()
  }, [])

  useEffect(() => {
    if (opcoes.length > 0 && feedback === null) {
      const explicacao = fase === "avancado" ? "Com que letra começa essa palavra?" : "Qual letra é esta?"

      setTimeout(() => {
        falar(explicacao)
      }, 500)
    }
  }, [opcoes, fase, feedback])

  const falar = (texto: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(texto)
      utterance.lang = "pt-BR"
      utterance.rate = 0.7
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }

  const gerarNovoExercicio = () => {
    const letrasDisponiveis = alfabeto.filter((item) => !letrasUsadas.has(item.letra))

    if (letrasDisponiveis.length === 0) {
      setLetrasUsadas(new Set())
      return gerarNovoExercicio()
    }

    const letraCorreta = letrasDisponiveis[Math.floor(Math.random() * letrasDisponiveis.length)]

    setLetrasUsadas((prev) => new Set(prev).add(letraCorreta.letra))

    const opcoesExercicio = [letraCorreta]
    const indicesUsados = new Set([alfabeto.indexOf(letraCorreta)])

    while (opcoesExercicio.length < 4) {
      const indiceAleatorio = Math.floor(Math.random() * alfabeto.length)
      if (!indicesUsados.has(indiceAleatorio)) {
        opcoesExercicio.push(alfabeto[indiceAleatorio])
        indicesUsados.add(indiceAleatorio)
      }
    }

    const opcoesEmbaralhadas = opcoesExercicio.sort(() => Math.random() - 0.5)
    setOpcoes(opcoesEmbaralhadas)
    setRespostaCorreta(letraCorreta.letra)
    setFeedback(null)
  }

  const verificarResposta = (letraSelecionada: string) => {
    if (letraSelecionada === respostaCorreta) {
      setFeedback("correto")
      setAcertos(acertos + 1)
      falar("Parabéns! Você acertou!")
      setTimeout(() => {
        proximoExercicio()
      }, 2500)
    } else {
      setFeedback("incorreto")
      falar("Tente novamente!")
    }
  }

  const proximoExercicio = () => {
    if (exercicioAtual < totalExercicios - 1) {
      setExercicioAtual(exercicioAtual + 1)
      gerarNovoExercicio()
    } else {
      if (fase === "normal") {
        setFase("avancado")
        setExercicioAtual(0)
        setAcertos(0)
        setConcluido(false)
        setLetrasUsadas(new Set())
        gerarNovoExercicio()
      } else {
        setConcluido(true)
      }
    }
  }

  const letraAtual = opcoes.find((o) => o.letra === respostaCorreta)
  const progresso = ((exercicioAtual + 1) / totalExercicios) * 100

  const coresBotoes = [
    "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    "bg-pink-500 hover:bg-pink-600 text-white border-pink-600",
    "bg-orange-500 hover:bg-orange-600 text-white border-orange-600",
    "bg-purple-500 hover:bg-purple-600 text-white border-purple-600",
  ]

  if (concluido) {
    const percentualAcertos = (acertos / totalExercicios) * 100

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-pink-100 to-orange-100">
        <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl border-4 border-primary">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-balance">
                Parabéns!
              </h1>
              <p className="text-2xl md:text-3xl text-foreground text-balance">
                Você completou todos os exercícios do alfabeto!
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border-4 border-blue-300 space-y-4">
              <p className="text-3xl font-bold text-foreground">
                Você acertou {acertos} de {totalExercicios} exercícios
              </p>
              <p className="text-2xl text-muted-foreground">{percentualAcertos.toFixed(0)}% de acertos</p>
            </div>

            <Link href="/leitura">
              <Button
                size="lg"
                className="px-12 py-8 text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl shadow-lg"
              >
                Continuar para Leitura
                <ArrowRight className="w-8 h-8 ml-3" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-pink-100 to-orange-100">
      <div className="w-full max-w-5xl space-y-6">
        <Card className="p-6 shadow-lg border-4 border-primary">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                {fase === "avancado" ? "Modo Avançado - Adivinhe a Letra!" : "Exercícios do Alfabeto"}
              </h2>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {exercicioAtual + 1} / {totalExercicios}
              </span>
            </div>
            <div className="h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-8 md:p-12 shadow-2xl border-4 border-secondary">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {fase === "avancado" ? "Com qual letra começa?" : "Qual letra é esta?"}
              </h2>
              {letraAtual && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border-4 border-orange-300">
                  <div className="text-9xl mb-4">{letraAtual.imagem}</div>
                  {fase === "normal" && (
                    <p className="text-3xl md:text-4xl font-bold text-foreground">{letraAtual.palavra}</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {opcoes.map((opcao, index) => (
                <Button
                  key={index}
                  onClick={() => verificarResposta(opcao.letra)}
                  disabled={feedback !== null}
                  size="lg"
                  className={`py-16 text-6xl font-bold rounded-2xl shadow-lg transition-all border-4 ${
                    feedback === "correto" && opcao.letra === respostaCorreta
                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700"
                      : feedback === "incorreto" && opcao.letra === respostaCorreta
                        ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700"
                        : feedback === "incorreto" && opcao.letra !== respostaCorreta
                          ? "bg-muted text-muted-foreground border-muted"
                          : coresBotoes[index]
                  }`}
                >
                  {opcao.letra}
                </Button>
              ))}
            </div>

            {feedback === "correto" && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-4 border-green-500">
                  <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-green-700">Muito bem! Resposta correta!</p>
                  {fase === "avancado" && letraAtual && (
                    <p className="text-2xl text-green-600 mt-2">
                      {letraAtual.letra} de {letraAtual.palavra}
                    </p>
                  )}
                </div>
              </div>
            )}

            {feedback === "incorreto" && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-4 border-red-500">
                  <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-red-700">Tente novamente!</p>
                </div>
                <Button
                  onClick={() => setFeedback(null)}
                  size="lg"
                  className="w-full px-12 py-8 text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-foreground rounded-2xl shadow-lg"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}

            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300">
              <p className="text-xl font-semibold text-foreground">Acertos até agora: {acertos}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
