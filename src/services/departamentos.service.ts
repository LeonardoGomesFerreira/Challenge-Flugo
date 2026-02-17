import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Departamento } from '../types/Departamento'

const ref = collection(db, 'Departamentos')

export async function criarDepartamento(data: Omit<Departamento, 'id'>) {
  const docRef = await addDoc(ref, {
    nome: data.nome,
    gestorId: data.gestorId,
    colaboradorIds: data.colaboradorIds ?? [],
    criadoEm: serverTimestamp(),
  })
  return docRef.id
}

export async function listarDepartamentos(): Promise<Departamento[]> {
  const q = query(ref, orderBy('criadoEm', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Departamento, 'id'>) }))
}

export async function atualizarDepartamento(id: string, updates: Partial<Departamento>) {
  if (!id) throw new Error('ID do departamento é obrigatório')
  const docRef = doc(db, 'Departamentos', id)
  await updateDoc(docRef, {
    ...updates,
    atualizadoEm: serverTimestamp(),
  })
}

export async function excluirDepartamento(id: string) {
  if (!id) throw new Error('ID do departamento é obrigatório')
  const docRef = doc(db, 'Departamentos', id)
  await deleteDoc(docRef)
}

export async function adicionarColaboradoresAoDepartamento(departamentoId: string, colaboradorIds: string[]) {
  if (!departamentoId) throw new Error('departamentoId é obrigatório')
  const docRef = doc(db, 'Departamentos', departamentoId)
  await updateDoc(docRef, {
    colaboradorIds: arrayUnion(...colaboradorIds),
    atualizadoEm: serverTimestamp(),
  })
}

export async function removerColaboradoresDoDepartamento(departamentoId: string, colaboradorIds: string[]) {
  if (!departamentoId) throw new Error('departamentoId é obrigatório')
  const docRef = doc(db, 'Departamentos', departamentoId)
  await updateDoc(docRef, {
    colaboradorIds: arrayRemove(...colaboradorIds),
    atualizadoEm: serverTimestamp(),
  })
}

/**
 * Transferência atômica (batch): remove do depto antigo, adiciona no novo.
 */
export async function transferirColaboradorDeDepartamento(opts: {
  colaboradorId: string
  fromDepartamentoId: string
  toDepartamentoId: string
}) {
  const { colaboradorId, fromDepartamentoId, toDepartamentoId } = opts
  if (!colaboradorId) throw new Error('colaboradorId é obrigatório')
  if (!fromDepartamentoId || !toDepartamentoId) throw new Error('Departamento origem/destino são obrigatórios')
  if (fromDepartamentoId === toDepartamentoId) return

  const batch = writeBatch(db)
  batch.update(doc(db, 'Departamentos', fromDepartamentoId), {
    colaboradorIds: arrayRemove(colaboradorId),
    atualizadoEm: serverTimestamp(),
  })
  batch.update(doc(db, 'Departamentos', toDepartamentoId), {
    colaboradorIds: arrayUnion(colaboradorId),
    atualizadoEm: serverTimestamp(),
  })
  await batch.commit()
}

export async function getDepartamento(id: string): Promise<Departamento | null> {
  const snap = await getDoc(doc(db, 'Departamentos', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Departamento, 'id'>) }
}
