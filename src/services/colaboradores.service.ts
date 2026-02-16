import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from './firebase'
import type { Colaborador } from '../types/Colaborador'

const ref = collection(db, 'Colaboradores')

export const criarColaborador = async (data: Colaborador) => {
  try {
    await addDoc(ref, {
      nome: data.nome,
      email: data.email,
      departamento: data.departamento,
      ativo: data.ativo,
      criadoEm: serverTimestamp(),
    })
  } catch (error) {
    console.error('Erro ao criar colaborador:', error)
    throw error
  }
}

export const listarColaboradores = async (): Promise<Colaborador[]> => {
  try {
    const q = query(ref, orderBy('criadoEm', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Colaborador, 'id'>),
    }))
  } catch (error) {
    console.error('Erro ao listar colaboradores:', error)
    return []
  }
}

export const atualizarColaborador = async (
  id: string,
  updates: Partial<Colaborador>
): Promise<void> => {
  try {
    // Validações
    if (updates.departamento !== undefined && !updates.departamento.trim()) {
      throw new Error('Departamento não pode ser vazio')
    }

    const docRef = doc(db, 'Colaboradores', id)
    
    await updateDoc(docRef, {
      ...updates,
      atualizadoEm: serverTimestamp(),
    })
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error)
    throw error
  }
}

export const excluirColaborador = async (id: string): Promise<void> => {
  try {
    // Validação
    if (!id) {
      throw new Error('ID do colaborador é obrigatório')
    }

    const docRef = doc(db, 'Colaboradores', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error)
    throw error
  }
}