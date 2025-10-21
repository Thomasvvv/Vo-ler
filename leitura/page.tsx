"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Volume2, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const licoes = [
  {
    titulo: "Palavras Simples",
    palavras: [
      { palavra: "CASA", silabas: ["CA", "SA"], imagem: "🏠" },
      { palavra: "BOLA", silabas: ["BO", "LA"], imagem: "⚽" },
      { palavra: "GATO", silabas: ["GA", "TO"], imagem: "🐱" },
      { palavra: "PATO", silabas: ["PA", "TO"], imagem: "🦆" },
      { palavra: "SAPO", silabas: ["SA", "PO"], imagem: "🐸" },
    ],
  },
  {
    titulo: "Frases Curtas",
    frases: [
      { texto: "O SOL BRILHA", palavras: ["O", "SOL", "BRILHA"], imagem: "☀️" },
      { texto: "A CASA É BONITA", palavras: ["A", "CASA", "É", "BONITA"], imagem: "🏠" },
      { texto: "O GATO DORME", palavras: ["O", "GATO", "DORME"], imagem: "🐱" },
      { texto: "EU GOSTO DE LER", palavras: ["EU", "GOSTO", "DE", "LER"], imagem: "📚" },
      { texto: "A FLOR É LINDA", palavras: ["A", "FLOR", "É", "LINDA"], imagem: "🌸" },
    ],
  },
  {
    titulo: "Textos Pequenos",
    textos: [
      {
        titulo: "O DIA",
        texto: "O SOL NASCE CEDO.\nOS PÁSSAROS CANTAM.\nO DIA É BONITO.",
        imagem: "🌅",
      },
      {
        titulo: "MEU AMIGO",
        texto: "EU TENHO UM AMIGO.\nELE É LEGAL.\nNÓS BRINCAMOS JUNTOS.",
        imagem: "👥",
      },
    ],
  },
]

function embaralharArray<T>(array: T[]): T[] {
  const novoArray = [...array]
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
  }
  return novoArray
}

export default function AprendizadoLeitura() {
  const router = useRouter()
  const [licaoAtual, setLicaoAtual] = useState(0)
  const [itemAtual, setItemAtual] = useState(0)
  const [modo, setModo] = useState<"ler" | "exercicio">("ler")
  const [respostaUsuario, setRespostaUsuario] = useState("")
  const [feedback, setFeedback] = useState<"correto" | "incorreto" | null>(null)
  const [silabasSelecionadas, setSilabasSelecionadas] = useState<string[]>([])
  const [silabasEmbaralhadas, setSilabasEmbaralhadas] = useState<string[]>([])

  const licao = licoes[licaoAtual]
  const totalItens = licao.palavras?.length || licao.frases?.length || licao.textos?.length || 0
  const progresso = ((itemAtual + 1) / totalItens) * 100

  useEffect(() => {
    if (
      modo === "exercicio" &&
      silabasEmbaralhadas.length > 0 &&
      feedback === null &&
      silabasSelecionadas.length === 0
    ) {
      setTimeout(() => {
        falar("Junte as sílabas para formar a palavra da imagem")
      }, 500)
    }
  }, [modo, silabasEmbaralhadas, feedback, silabasSelecionadas])

  const falar = (texto: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(texto)
      utterance.lang = "pt-BR"
      utterance.rate = 0.7
      window.speechSynthesis.speak(utterance)
    }
  }

  const falarSilaba = (silaba: string) => {
    if ("speechSynthesis" in window) {
      const mapeamentoFonetico: { [key: string]: string } = {
        BA: "bá",
        BE: "bé",
        BI: "bí",
        BO: "bó",
        BU: "bú",
        CA: "cá",
        CE: "cé",
        CI: "cí",
        CO: "có",
        CU: "cú",
        DA: "dá",
        DE: "dé",
        DI: "dí",
        DO: "dó",
        DU: "dú",
        FA: "fá",
        FE: "fé",
        FI: "fí",
        FO: "fó",
        FU: "fú",
        GA: "gá",
        GE: "gué",
        GI: "guí",
        GO: "gó",
        GU: "gú",
        JA: "já",
        JE: "jé",
        JI: "jí",
        JO: "jó",
        JU: "jú",
        LA: "lá",
        LE: "lé",
        LI: "lí",
        LO: "ló",
        LU: "lú",
        MA: "má",
        ME: "mé",
        MI: "mí",
        MO: "mó",
        MU: "mú",
        NA: "ná",
        NE: "né",
        NI: "ní",
        NO: "nó",
        NU: "nú",
        PA: "pá",
        PE: "pé",
        PI: "pí",
        PO: "pó",
        PU: "pú",
        RA: "rá",
        RE: "ré",
        RI: "rí",
        RO: "ró",
        RU: "rú",
        SA: "sá",
        SE: "sé",
        SI: "sí",
        SO: "só",
        SU: "sú",
        TA: "tá",
        TE: "té",
        TI: "tí",
        TO: "tó",
        TU: "tú",
        VA: "vá",
        VE: "vé",
        VI: "ví",
        VO: "vó",
        VU: "vú",
        ZA: "zá",
        ZE: "zé",
        ZI: "zí",
        ZO: "zó",
        ZU: "zú",
      }

      // Usa o mapeamento fonético ou a sílaba original em minúsculas
      const silabaFonetica = mapeamentoFonetico[silaba] || silaba.toLowerCase()

      const utterance = new SpeechSynthesisUtterance(silabaFonetica)
      utterance.lang = "pt-BR"
      utterance.rate = 0.8 // Taxa mais natural
      utterance.pitch = 1.0 // Tom normal
      utterance.volume = 1.0 // Volume máximo
      window.speechSynthesis.speak(utterance)
    }
  }

  const falarPalavra = (palavra: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(palavra.toLowerCase())
      utterance.lang = "pt-BR"
      utterance.rate = 0.6 // Taxa mais lenta para melhor compreensão
      utterance.pitch = 1.1 // Tom ligeiramente mais alto
      window.speechSynthesis.speak(utterance)
    }
  }

  const prepararExercicio = (palavra: { palavra: string; silabas: string[]; imagem: string }) => {
    const silabasCorretas = [...palavra.silabas]

    console.log("[v0] Palavra:", palavra.palavra)
    console.log("[v0] Sílabas corretas:", silabasCorretas)

    const todasSilabasDisponiveis = [
      "BA",
      "BE",
      "BI",
      "BO",
      "BU",
      "CA",
      "CE",
      "CI",
      "CO",
      "CU",
      "DA",
      "DE",
      "DI",
      "DO",
      "DU",
      "FA",
      "FE",
      "FI",
      "FO",
      "FU",
      "GA",
      "GE",
      "GI",
      "GO",
      "GU",
      "JA",
      "JE",
      "JI",
      "JO",
      "JU",
      "LA",
      "LE",
      "LI",
      "LO",
      "LU",
      "MA",
      "ME",
      "MI",
      "MO",
      "MU",
      "NA",
      "NE",
      "NI",
      "NO",
      "NU",
      "PA",
      "PE",
      "PI",
      "PO",
      "PU",
      "RA",
      "RE",
      "RI",
      "RO",
      "RU",
      "SA",
      "SE",
      "SI",
      "SO",
      "SU",
      "TA",
      "TE",
      "TI",
      "TO",
      "TU",
      "VA",
      "VE",
      "VI",
      "VO",
      "VU",
      "ZA",
      "ZE",
      "ZI",
      "ZO",
      "ZU",
    ]

    const distratoras = embaralharArray(todasSilabasDisponiveis.filter((s) => !silabasCorretas.includes(s))).slice(0, 6)

    const todasSilabas = embaralharArray([...silabasCorretas, ...distratoras])

    console.log("[v0] Sílabas embaralhadas:", todasSilabas)
    console.log(
      "[v0] Contém todas as corretas?",
      silabasCorretas.every((s) => todasSilabas.includes(s)),
    )

    setSilabasEmbaralhadas(todasSilabas)
    setSilabasSelecionadas([])
    setFeedback(null)
  }

  const iniciarExercicio = () => {
    if (licao.palavras) {
      const palavra = licao.palavras[itemAtual]
      prepararExercicio(palavra)
      setModo("exercicio")
    }
  }

  const selecionarSilaba = (silaba: string) => {
    falarSilaba(silaba)
    setSilabasSelecionadas([...silabasSelecionadas, silaba])
  }

  const removerUltimaSilaba = () => {
    setSilabasSelecionadas(silabasSelecionadas.slice(0, -1))
  }

  const verificarExercicio = () => {
    if (licao.palavras) {
      const palavra = licao.palavras[itemAtual]
      const respostaCorreta = palavra.silabas.join("")
      const respostaUsuario = silabasSelecionadas.join("")

      if (respostaCorreta === respostaUsuario) {
        setFeedback("correto")
        falar("Parabéns! Você acertou!")
        setTimeout(() => {
          proximoItem()
        }, 2500)
      } else {
        setFeedback("incorreto")
        falar("Tente novamente!")
        setTimeout(() => {
          setSilabasSelecionadas([])
          setFeedback(null)
        }, 2000)
      }
    }
  }

  const proximoItem = () => {
    if (itemAtual < totalItens - 1) {
      setItemAtual(itemAtual + 1)
      setFeedback(null)
      setRespostaUsuario("")
      setSilabasSelecionadas([])

      if (modo === "exercicio" && licao.palavras) {
        const proximaPalavra = licao.palavras[itemAtual + 1]
        prepararExercicio(proximaPalavra)
      }
    } else {
      if (licao.palavras && modo === "ler") {
        setItemAtual(0)
        setModo("exercicio")
        const primeiraPalavra = licao.palavras[0]
        prepararExercicio(primeiraPalavra)
      } else if (licao.palavras && modo === "exercicio") {
        router.push("/nome")
      } else if (licaoAtual < licoes.length - 1) {
        setLicaoAtual(licaoAtual + 1)
        setItemAtual(0)
        setModo("ler")
        setFeedback(null)
        setRespostaUsuario("")
        setSilabasSelecionadas([])
      } else {
        router.push("/nome")
      }
    }
  }

  const renderConteudo = () => {
    if (licao.palavras) {
      const palavra = licao.palavras[itemAtual]

      if (modo === "exercicio") {
        return (
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Junte as sílabas para formar a palavra da imagem:
            </h3>

            <div className="text-9xl">{palavra.imagem}</div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl border-4 border-purple-300 min-h-[120px] flex items-center justify-center">
              {silabasSelecionadas.length > 0 ? (
                <div className="flex gap-2 flex-wrap justify-center">
                  {silabasSelecionadas.map((silaba, index) => (
                    <div key={index} className="bg-white px-6 py-4 rounded-xl border-2 border-purple-400 shadow-lg">
                      <span className="text-5xl font-bold text-purple-600">{silaba}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-2xl text-gray-500 italic">Clique nas sílabas abaixo...</p>
              )}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              {silabasSelecionadas.length > 0 && (
                <Button
                  onClick={removerUltimaSilaba}
                  variant="outline"
                  className="px-6 py-4 text-lg border-2 border-red-400 text-red-600 hover:bg-red-100 rounded-xl bg-transparent"
                >
                  <X className="w-5 h-5 mr-2" />
                  Remover Última
                </Button>
              )}

              {silabasSelecionadas.length > 0 && (
                <Button
                  onClick={verificarExercicio}
                  className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Verificar
                </Button>
              )}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              {silabasEmbaralhadas.map((silaba, index) => (
                <button
                  key={index}
                  onClick={() => selecionarSilaba(silaba)}
                  disabled={
                    silabasSelecionadas.includes(silaba) &&
                    silabasSelecionadas.filter((s) => s === silaba).length >=
                      silabasEmbaralhadas.filter((s) => s === silaba).length
                  }
                  className="bg-gradient-to-br from-blue-100 to-cyan-100 px-8 py-6 rounded-2xl border-4 border-blue-400 hover:border-blue-600 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {silaba}
                  </span>
                </button>
              ))}
            </div>

            {feedback === "correto" && (
              <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-4 border-green-400 animate-bounce">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-green-700">Parabéns! Você acertou!</p>
              </div>
            )}

            {feedback === "incorreto" && (
              <div className="p-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl border-4 border-red-400 animate-shake">
                <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-red-700">Ops! Tente novamente!</p>
              </div>
            )}
          </div>
        )
      }

      if (modo === "ler") {
        return (
          <div className="text-center space-y-8">
            <div className="text-9xl">{palavra.imagem}</div>

            <div className="space-y-6">
              <div className="flex justify-center gap-4 flex-wrap">
                {palavra.silabas.map((silaba, index) => (
                  <button
                    key={index}
                    onClick={() => falarSilaba(silaba)}
                    className="bg-gradient-to-br from-green-100 to-teal-100 px-8 py-6 rounded-2xl border-4 border-green-400 hover:border-green-600 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      {silaba}
                    </span>
                    <Volume2 className="w-16 h-16 text-green-600 mx-auto mt-2" />
                  </button>
                ))}
              </div>

              <p className="text-lg text-gray-600 italic">Clique nas sílabas para ouvir cada uma!</p>

              <div className="text-6xl md:text-7xl font-bold text-gray-800">{palavra.palavra}</div>
            </div>

            <Button
              onClick={() => falar(palavra.palavra)}
              size="lg"
              className="px-10 py-8 text-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all"
            >
              <Volume2 className="w-32 h-32 mr-3" />
              Ouvir a Palavra Completa
            </Button>

            <div className="flex justify-center pt-4">
              <Button
                onClick={proximoItem}
                size="lg"
                className="px-12 py-6 text-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
              >
                Próxima Palavra
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </div>
        )
      }
    }

    if (licao.frases) {
      const frase = licao.frases[itemAtual]

      return (
        <div className="text-center space-y-8">
          <div className="text-9xl">{frase.imagem}</div>

          <div className="space-y-6">
            <div className="flex justify-center gap-4 flex-wrap">
              {frase.palavras.map((palavra, index) => (
                <button
                  key={index}
                  onClick={() => falarPalavra(palavra)}
                  className="bg-gradient-to-br from-blue-100 to-cyan-100 px-6 py-4 rounded-2xl border-4 border-blue-400 hover:border-blue-600 hover:scale-110 transition-all cursor-pointer active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {palavra}
                  </span>
                  <Volume2 className="w-14 h-14 text-blue-600 mx-auto mt-2" />
                </button>
              ))}
            </div>

            <p className="text-lg text-gray-600 italic">Clique nas palavras para ouvir cada uma!</p>
          </div>

          <Button
            onClick={() => falar(frase.texto)}
            size="lg"
            className="px-10 py-8 text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl shadow-xl transform hover:scale-105 transition-all"
          >
            <Volume2 className="w-20 h-20 mr-3" />
            Ouvir a Frase Completa
          </Button>

          <Button
            onClick={proximoItem}
            size="lg"
            className="px-12 py-6 text-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Próxima Frase
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      )
    }

    if (licao.textos) {
      const texto = licao.textos[itemAtual]

      return (
        <div className="text-center space-y-8">
          <div className="text-9xl">{texto.imagem}</div>

          <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {texto.titulo}
          </h3>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-12 rounded-2xl border-2 border-purple-200">
            <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-relaxed whitespace-pre-line">
              {texto.texto}
            </p>
          </div>

          <Button
            onClick={() => falar(texto.texto)}
            size="lg"
            variant="outline"
            className="px-8 py-6 text-xl border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white rounded-xl bg-white transform hover:scale-105 transition-all"
          >
            <Volume2 className="w-18 h-18 mr-3" />
            Ouvir o Texto
          </Button>

          <Button
            onClick={proximoItem}
            size="lg"
            className="px-12 py-6 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            {itemAtual < totalItens - 1 ? "Próximo Texto" : "Concluir Lição"}
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-400 via-teal-400 to-cyan-400">
      <div className="w-full max-w-6xl space-y-6">
        <Card className="p-6 shadow-lg bg-white/95 backdrop-blur border-2 border-green-200">
          <div className="space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  {licao.titulo}
                </h2>
                <p className="text-xl text-gray-600">
                  Item {itemAtual + 1} de {totalItens}
                </p>
              </div>
              <Link href="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 py-4 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white rounded-xl bg-white"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Início
                </Button>
              </Link>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-500 rounded-full"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-12 shadow-2xl bg-white/95 backdrop-blur border-2 border-teal-200">{renderConteudo()}</Card>

        {itemAtual === totalItens - 1 && licaoAtual < licoes.length - 1 && modo !== "exercicio" && (
          <Card className="p-8 shadow-lg text-center bg-white/95 backdrop-blur border-2 border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Parabéns! Você completou esta lição!</h3>
            <Button
              onClick={() => {
                setLicaoAtual(licaoAtual + 1)
                setItemAtual(0)
                setModo("ler")
              }}
              size="lg"
              className="px-12 py-6 text-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Ir para Próxima Lição
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
