"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, ArrowRight, ArrowLeft } from "lucide-react"
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

export default function AprendizadoAlfabeto() {
  const [letraAtual, setLetraAtual] = useState(0)

  const letra = alfabeto[letraAtual]

  const falarLetra = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Letra ${letra.letra} de ${letra.palavra}`)
      utterance.lang = "pt-BR"
      utterance.rate = 0.6 // Taxa mais lenta
      utterance.pitch = 1.1 // Tom mais alto
      window.speechSynthesis.speak(utterance)
    }
  }

  const proximaLetra = () => {
    if (letraAtual < alfabeto.length - 1) {
      setLetraAtual(letraAtual + 1)
    }
  }

  const letraAnterior = () => {
    if (letraAtual > 0) {
      setLetraAtual(letraAtual - 1)
    }
  }

  const progresso = ((letraAtual + 1) / alfabeto.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <div className="w-full max-w-7xl space-y-8">
        <Card className="p-8 shadow-2xl bg-white border-4 border-blue-400 rounded-3xl">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-blue-700">Aprendendo o Alfabeto</h2>
              <span className="text-4xl font-bold text-purple-700 bg-purple-100 px-6 py-3 rounded-2xl">
                {letraAtual + 1} / {alfabeto.length}
              </span>
            </div>
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden border-4 border-gray-300 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full shadow-lg"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-16 shadow-2xl bg-white border-4 border-purple-400 rounded-3xl">
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <div className="text-[14rem] md:text-[20rem] font-black bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none drop-shadow-2xl">
                {letra.letra}
              </div>
              <Button
                onClick={falarLetra}
                size="lg"
                className="px-12 py-10 text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-3xl shadow-2xl transform hover:scale-110 transition-all border-4 border-green-600"
              >
                <Volume2 className="size-24 mr-4" />
                Ouvir a Letra
              </Button>
            </div>

            <div className="bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 p-12 rounded-3xl border-4 border-orange-300 shadow-xl space-y-6">
              <div className="text-9xl drop-shadow-lg">{letra.imagem}</div>
              <p className="text-6xl md:text-7xl font-black text-gray-800 drop-shadow-md">{letra.palavra}</p>
              <p className="text-4xl font-bold text-gray-700 bg-white/70 px-8 py-4 rounded-2xl inline-block">
                {letra.letra} de {letra.palavra}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-6">
              <Button
                onClick={letraAnterior}
                disabled={letraAtual === 0}
                size="lg"
                className="px-10 py-10 text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-3xl disabled:opacity-30 shadow-xl transform hover:scale-105 transition-all border-4 border-gray-600"
              >
                <ArrowLeft className="size-10 mr-3" />
                Anterior
              </Button>

              <Button
                onClick={proximaLetra}
                disabled={letraAtual === alfabeto.length - 1}
                size="lg"
                className="px-16 py-10 text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-3xl shadow-2xl transform hover:scale-105 transition-all border-4 border-purple-600"
              >
                Próxima Letra
                <ArrowRight className="size-10 ml-3" />
              </Button>
            </div>

            {letraAtual === alfabeto.length - 1 && (
              <Link href="/exercicios">
                <Button
                  size="lg"
                  className="w-full md:w-auto px-16 py-12 text-4xl font-black bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-3xl shadow-2xl mt-8 transform hover:scale-105 transition-all border-4 border-green-600 animate-pulse"
                >
                  Fazer Exercícios do Alfabeto
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
