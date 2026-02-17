export type NivelHierarquico = 'junior' | 'pleno' | 'senior' | 'gestor'

export interface ColaboradorProfissional {
  cargo: string
  dataAdmissao: string // ISO yyyy-mm-dd
  nivelHierarquico: NivelHierarquico
  gestorId: string // id de outro colaborador (nivel gestor)
  salarioBase: number
}

export interface Colaborador {
  id?: string
  nome: string
  email: string
  ativo: boolean

  // Relacionamento com Departamento
  departamentoId: string
  departamentoNome: string

  profissional: ColaboradorProfissional
}
