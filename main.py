from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

app = FastAPI(title="API de Alfabetização para Idosos")

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de dados
class RespostaAvaliacao(BaseModel):
    pergunta1: bool  # Sabe o alfabeto completo
    pergunta2: bool  # Identifica primeira letra
    pergunta3: bool  # Sabe escrever o nome

class ProgressoAluno(BaseModel):
    nome: Optional[str] = None
    nivel: str  # "alfabeto", "palavras", "frases", "textos"
    letras_aprendidas: List[str] = []
    palavras_aprendidas: List[str] = []
    exercicios_completados: int = 0
    modo_avancado_completado: bool = False
    silabas_completadas: bool = False
    nome_escrito: bool = False

class RespostaExercicio(BaseModel):
    tipo: str  # "alfabeto", "silabas", "nome"
    resposta: str
    correto: bool

# Banco de dados em memória (em produção, use um banco real)
alunos_db = {}

# Dados do alfabeto
ALFABETO = [
    {"letra": "A", "palavra": "Avião", "imagem": "airplane"},
    {"letra": "B", "palavra": "Bola", "imagem": "ball"},
    {"letra": "C", "palavra": "Casa", "imagem": "house"},
    {"letra": "D", "palavra": "Dado", "imagem": "dice"},
    {"letra": "E", "palavra": "Elefante", "imagem": "elephant"},
    {"letra": "F", "palavra": "Flor", "imagem": "flower"},
    {"letra": "G", "palavra": "Gato", "imagem": "cat"},
    {"letra": "H", "palavra": "Hotel", "imagem": "hotel"},
    {"letra": "I", "palavra": "Igreja", "imagem": "church"},
    {"letra": "J", "palavra": "Janela", "imagem": "window"},
    {"letra": "K", "palavra": "Kiwi", "imagem": "kiwi"},
    {"letra": "L", "palavra": "Lua", "imagem": "moon"},
    {"letra": "M", "palavra": "Maçã", "imagem": "apple"},
    {"letra": "N", "palavra": "Navio", "imagem": "ship"},
    {"letra": "O", "palavra": "Ovo", "imagem": "egg"},
    {"letra": "P", "palavra": "Pato", "imagem": "duck"},
    {"letra": "Q", "palavra": "Queijo", "imagem": "cheese"},
    {"letra": "R", "palavra": "Rato", "imagem": "mouse"},
    {"letra": "S", "palavra": "Sol", "imagem": "sun"},
    {"letra": "T", "palavra": "Tatu", "imagem": "armadillo"},
    {"letra": "U", "palavra": "Uva", "imagem": "grapes"},
    {"letra": "V", "palavra": "Vaca", "imagem": "cow"},
    {"letra": "W", "palavra": "Web", "imagem": "web"},
    {"letra": "X", "palavra": "Xícara", "imagem": "cup"},
    {"letra": "Y", "palavra": "Yoga", "imagem": "yoga"},
    {"letra": "Z", "palavra": "Zebra", "imagem": "zebra"},
]

PALAVRAS = [
    {"palavra": "CASA", "silabas": ["CA", "SA"], "imagem": "house"},
    {"palavra": "BOLA", "silabas": ["BO", "LA"], "imagem": "ball"},
    {"palavra": "GATO", "silabas": ["GA", "TO"], "imagem": "cat"},
    {"palavra": "PATO", "silabas": ["PA", "TO"], "imagem": "duck"},
    {"palavra": "SAPO", "silabas": ["SA", "PO"], "imagem": "frog"},
]

# Endpoints

@app.get("/")
def read_root():
    return {"message": "API de Alfabetização para Idosos"}

@app.post("/api/avaliacao")
def avaliar_nivel(resposta: RespostaAvaliacao):
    """
    Avalia o nível do aluno baseado nas respostas da avaliação inicial
    """
    if resposta.pergunta3:
        # Sabe escrever o nome - verificar
        return {"nivel": "verificar_nome", "redirect": "/nome"}
    elif resposta.pergunta1 and resposta.pergunta2:
        # Sabe alfabeto e identifica letras - pular para palavras
        return {"nivel": "palavras", "redirect": "/leitura"}
    else:
        # Começar do alfabeto
        return {"nivel": "alfabeto", "redirect": "/alfabeto"}

@app.get("/api/alfabeto")
def obter_alfabeto():
    """
    Retorna todas as letras do alfabeto com suas palavras e imagens
    """
    return {"alfabeto": ALFABETO}

@app.get("/api/alfabeto/{letra}")
def obter_letra(letra: str):
    """
    Retorna informações sobre uma letra específica
    """
    letra_upper = letra.upper()
    for item in ALFABETO:
        if item["letra"] == letra_upper:
            return item
    raise HTTPException(status_code=404, detail="Letra não encontrada")

@app.get("/api/palavras")
def obter_palavras():
    """
    Retorna todas as palavras para prática de leitura
    """
    return {"palavras": PALAVRAS}

@app.post("/api/exercicio/validar")
def validar_exercicio(resposta: RespostaExercicio):
    """
    Valida a resposta de um exercício
    """
    # Aqui você pode adicionar lógica mais complexa de validação
    return {
        "correto": resposta.correto,
        "mensagem": "Muito bem! Resposta correta!" if resposta.correto else "Tente novamente!",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/progresso/salvar")
def salvar_progresso(aluno_id: str, progresso: ProgressoAluno):
    """
    Salva o progresso do aluno
    """
    alunos_db[aluno_id] = progresso.dict()
    return {"message": "Progresso salvo com sucesso", "aluno_id": aluno_id}

@app.get("/api/progresso/{aluno_id}")
def obter_progresso(aluno_id: str):
    """
    Obtém o progresso de um aluno específico
    """
    if aluno_id not in alunos_db:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")
    return alunos_db[aluno_id]

@app.post("/api/silabas/gerar")
def gerar_exercicio_silabas(palavra: str):
    """
    Gera um exercício de juntar sílabas para uma palavra
    """
    palavra_upper = palavra.upper()
    palavra_obj = next((p for p in PALAVRAS if p["palavra"] == palavra_upper), None)
    
    if not palavra_obj:
        raise HTTPException(status_code=404, detail="Palavra não encontrada")
    
    # Sílabas corretas
    silabas_corretas = palavra_obj["silabas"]
    
    # Gerar sílabas distratoras
    todas_silabas = ["BA", "BE", "BI", "BO", "BU", "CA", "CE", "CI", "CO", "CU",
                     "DA", "DE", "DI", "DO", "DU", "FA", "FE", "FI", "FO", "FU",
                     "GA", "GE", "GI", "GO", "GU", "LA", "LE", "LI", "LO", "LU",
                     "MA", "ME", "MI", "MO", "MU", "NA", "NE", "NI", "NO", "NU",
                     "PA", "PE", "PI", "PO", "PU", "RA", "RE", "RI", "RO", "RU",
                     "SA", "SE", "SI", "SO", "SU", "TA", "TE", "TI", "TO", "TU"]
    
    distratoras = [s for s in todas_silabas if s not in silabas_corretas][:4]
    
    # Combinar e embaralhar
    import random
    opcoes = silabas_corretas + distratoras
    random.shuffle(opcoes)
    
    return {
        "palavra": palavra_upper,
        "silabas_corretas": silabas_corretas,
        "opcoes": opcoes,
        "imagem": palavra_obj["imagem"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
