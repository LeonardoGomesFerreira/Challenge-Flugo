import { Avatar } from '@mui/material'

// Lista de nomes femininos comuns em português
const nomesFemininos = [
  'ana', 'maria', 'julia', 'beatriz', 'laura', 'isabela', 'manuela', 'giovanna',
  'sophia', 'alice', 'helena', 'valentina', 'marina', 'clara', 'cecilia',
  'fernanda', 'gabriela', 'carolina', 'camila', 'amanda', 'jessica', 'patricia',
  'rafaela', 'daniela', 'juliana', 'mariana', 'luciana', 'adriana', 'renata',
  'paula', 'carla', 'bianca', 'larissa', 'natalia', 'bruna', 'aline', 'tatiana',
  'vanessa', 'claudia', 'sandra', 'joana', 'eva', 'rosa', 'rita', 'lucia',
  'silvia', 'vera', 'eliana', 'andrea', 'monica', 'debora', 'leticia', 'thais',
  'sara', 'livia', 'melissa', 'flavia', 'viviane', 'cristina', 'roberta',
  'marcela', 'sabrina', 'nicole', 'priscila', 'simone', 'karina', 'regina',
  'denise', 'elaine', 'sonia', 'marta', 'ines', 'tereza', 'joana', 'mari',
  'clara', 'isabel', 'vitoria', 'emilia', 'luna', 'lara', 'milena', 'elisa'
]

function detectarGenero(nome: string): 'feminino' | 'masculino' {
  const primeiroNome = nome.trim().split(' ')[0].toLowerCase()
  
  // Verifica se o nome está na lista de nomes femininos
  if (nomesFemininos.some(n => primeiroNome.includes(n) || n.includes(primeiroNome))) {
    return 'feminino'
  }
  
  // Verifica terminações comuns femininas
  if (primeiroNome.endsWith('a') || primeiroNome.endsWith('e')) {
    return 'feminino'
  }
  
  return 'masculino'
}

interface AvatarColaboradorProps {
  nome: string
  size?: number
}

export function AvatarColaborador({ nome, size = 40 }: AvatarColaboradorProps) {
  const genero = detectarGenero(nome)
  const inicial = nome?.[0]?.toUpperCase() ?? '?'
  
  return (
    <Avatar 
      sx={{ 
        width: size, 
        height: size, 
        bgcolor: genero === 'feminino' ? '#EC4899' : '#3B82F6',
        fontSize: size * 0.5,
        fontWeight: 600,
      }}
    >
      {inicial}
    </Avatar>
  )
}