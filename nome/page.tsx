"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Volume2, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DesafioNome() {
  const [nomeAluno, setNomeAluno] = useState("")
  const [nomeDigitado, setNomeDigitado] = useState("")
  const [tentativas, setTentativas] = useState(0)
  const [acertou, setAcertou] = useState(false)

  useEffect(() => {
    const nomeSalvo = localStorage.getItem("nomeAluno") || "SEU NOME"
    setNomeAluno(nomeSalvo.toUpperCase())
  }, [])

  const falarNome = () => {
    const utterance = new SpeechSynthesisUtterance(nomeAluno.toLowerCase())
    utterance.lang = "pt-BR"
    utterance.rate = 0.6
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }

  const verificarNome = () => {
    setTentativas(tentativas + 1)
    if (nomeDigitado.toUpperCase().trim() === nomeAluno.trim()) {
      setAcertou(true)
      const utterance = new SpeechSynthesisUtterance("Parabéns! Você acertou!")
      utterance.lang = "pt-BR"
      utterance.rate = 0.6
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    } else {
      const utterance = new SpeechSynthesisUtterance("Tente novamente! Você consegue!")
      utterance.lang = "pt-BR"
      utterance.rate = 0.6
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  if (acertou) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400">
        <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl bg-white/95 backdrop-blur">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-balance">
                Parabéns! 🎉
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 text-balance">
                Você conseguiu escrever seu nome corretamente!
              </p>
              <p className="text-xl text-gray-600">Tentativas: {tentativas}</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-orange-200">
              <p className="text-4xl font-bold text-orange-600">{nomeAluno}</p>
            </div>

            <Link href="/leitura">
              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-8 text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
              >
                Continuar Aprendendo
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400">
      <Card className="w-full max-w-4xl p-8 md:p-12 shadow-2xl bg-white/95 backdrop-blur">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-balance">
              Desafio Final: Escreva Seu Nome
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 text-balance">
              Ouça com atenção e escreva seu nome abaixo:
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-orange-200 space-y-6">
            <div className="flex items-center justify-center gap-4">
              <p className="text-3xl md:text-4xl font-bold text-orange-600">Seu nome é:</p>
              <Button
                onClick={falarNome}
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all"
              >
                <Volume2 className="w-20 h-20" />
              </Button>
            </div>
            <p className="text-xl text-gray-600 text-center">Clique no ícone para ouvir</p>
          </div>

          <div className="space-y-6">
            <input
              type="text"
              value={nomeDigitado}
              onChange={(e) => setNomeDigitado(e.target.value)}
              placeholder="Digite seu nome aqui..."
              className="w-full px-8 py-8 text-3xl md:text-4xl font-bold text-center border-4 border-orange-300 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all bg-white"
              autoFocus
            />

            <Button
              onClick={verificarNome}
              size="lg"
              disabled={!nomeDigitado.trim()}
              className="w-full py-10 text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-10 h-10 mr-3" />
              Verificar
            </Button>

            {tentativas > 0 && !acertou && (
              <div className="text-center">
                <p className="text-xl text-red-600 font-semibold">Tente novamente! Você consegue! 💪</p>
                <p className="text-lg text-gray-600 mt-2">Tentativas: {tentativas}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
