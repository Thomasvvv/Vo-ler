# Backend Python - Sistema de Alfabetização para Idosos

Backend em Python usando FastAPI para gerenciar a lógica de negócios do sistema de alfabetização.

## Instalação

```bash
cd backend
pip install -r requirements.txt
```

## Executar o servidor

```bash
python main.py
```

Ou usando uvicorn diretamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Documentação da API

Após iniciar o servidor, acesse:
- Documentação interativa (Swagger): http://localhost:8000/docs
- Documentação alternativa (ReDoc): http://localhost:8000/redoc

## Endpoints Principais

### Avaliação
- `POST /api/avaliacao` - Avalia o nível do aluno baseado nas respostas

### Alfabeto
- `GET /api/alfabeto` - Retorna todas as letras do alfabeto
- `GET /api/alfabeto/{letra}` - Retorna informações sobre uma letra específica

### Palavras
- `GET /api/palavras` - Retorna todas as palavras para prática

### Exercícios
- `POST /api/exercicio/validar` - Valida a resposta de um exercício
- `POST /api/silabas/gerar` - Gera exercício de juntar sílabas

### Progresso
- `POST /api/progresso/salvar` - Salva o progresso do aluno
- `GET /api/progresso/{aluno_id}` - Obtém o progresso de um aluno

## Estrutura de Dados

### RespostaAvaliacao
\`\`\`json
{
  "pergunta1": true,
  "pergunta2": true,
  "pergunta3": false
}
\`\`\`

### ProgressoAluno
\`\`\`json
{
  "nome": "João",
  "nivel": "alfabeto",
  "letras_aprendidas": ["A", "B", "C"],
  "palavras_aprendidas": ["CASA", "BOLA"],
  "exercicios_completados": 5,
  "modo_avancado_completado": false,
  "silabas_completadas": false,
  "nome_escrito": false
}
\`\`\`

## Próximos Passos

1. Integrar com banco de dados real (PostgreSQL, MongoDB, etc.)
2. Adicionar autenticação e autorização
3. Implementar sistema de relatórios para professores
4. Adicionar mais exercícios e atividades
5. Implementar sistema de gamificação (pontos, badges, etc.)
