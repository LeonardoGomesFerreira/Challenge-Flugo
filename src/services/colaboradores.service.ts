import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  type DocumentData,
} from 'firebase/firestore'

import { db } from './firebase'
import type { Colaborador } from '../types/Colaborador'

const ref = collection(db, 'Colaboradores')

async function getDepartamentoNome(departamentoId: string): Promise<string> {
  const snap = await getDoc(doc(db, 'Departamentos', departamentoId))
  if (!snap.exists()) return ''

  const data = snap.data() as DocumentData | undefined
  return String(data?.nome ?? '')
}

export const criarColaborador = async (data: Colaborador): Promise<void> => {
  try {
    if (!data.departamentoId) {
      throw new Error('Departamento é obrigatório')
    }

    const departamentoNome =
      data.departamentoNome ||
      (await getDepartamentoNome(data.departamentoId))

    const created = await addDoc(ref, {
      nome: data.nome,
      email: data.email,
      ativo: data.ativo,
      departamentoId: data.departamentoId,
      departamentoNome,
      profissional: {
        cargo: data.profissional.cargo,
        dataAdmissao: data.profissional.dataAdmissao,
        nivelHierarquico: data.profissional.nivelHierarquico,
        gestorId: data.profissional.gestorId,
        salarioBase: data.profissional.salarioBase,
      },
      criadoEm: serverTimestamp(),
    })

    await updateDoc(doc(db, 'Departamentos', data.departamentoId), {
      colaboradorIds: arrayUnion(created.id),
      atualizadoEm: serverTimestamp(),
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

    return snapshot.docs.map((d) => {
      const raw = d.data() as DocumentData

      const departamentoNome = String(
        raw.departamentoNome ?? raw.departamento ?? ''
      )

      const profissionalRaw = (raw.profissional ?? {}) as DocumentData

      return {
        id: d.id,
        nome: String(raw.nome ?? ''),
        email: String(raw.email ?? ''),
        ativo: Boolean(raw.ativo),
        departamentoId: String(raw.departamentoId ?? ''),
        departamentoNome,
        profissional: {
          cargo: String(profissionalRaw.cargo ?? ''),
          dataAdmissao: String(profissionalRaw.dataAdmissao ?? ''),
          nivelHierarquico: (
            profissionalRaw.nivelHierarquico ?? 'junior'
          ) as Colaborador['profissional']['nivelHierarquico'],
          gestorId: String(profissionalRaw.gestorId ?? ''),
          salarioBase: Number(profissionalRaw.salarioBase ?? 0),
        },
      } satisfies Colaborador
    })
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
    if (!id) throw new Error('ID do colaborador é obrigatório')

    const docRef = doc(db, 'Colaboradores', id)
    const currentSnap = await getDoc(docRef)

    if (!currentSnap.exists()) {
      throw new Error('Colaborador não encontrado')
    }

    const current = currentSnap.data() as DocumentData

    const nextDeptId = updates.departamentoId ?? current.departamentoId

    if (!nextDeptId || !String(nextDeptId).trim()) {
      throw new Error('Departamento não pode ser vazio')
    }

    const prevDeptId = String(current.departamentoId ?? '')
    const newDeptId = String(nextDeptId)

    let departamentoNome = updates.departamentoNome

    if (updates.departamentoId && !departamentoNome) {
      departamentoNome = await getDepartamentoNome(newDeptId)
    }

    const batch = writeBatch(db)

    batch.update(docRef, {
      ...updates,
      departamentoId: newDeptId,
      ...(departamentoNome !== undefined
        ? { departamentoNome }
        : {}),
      atualizadoEm: serverTimestamp(),
    })

    if (prevDeptId && prevDeptId !== newDeptId) {
      batch.update(doc(db, 'Departamentos', prevDeptId), {
        colaboradorIds: arrayRemove(id),
        atualizadoEm: serverTimestamp(),
      })

      batch.update(doc(db, 'Departamentos', newDeptId), {
        colaboradorIds: arrayUnion(id),
        atualizadoEm: serverTimestamp(),
      })
    }

    await batch.commit()
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error)
    throw error
  }
}

export const excluirColaborador = async (id: string): Promise<void> => {
  try {
    if (!id) throw new Error('ID do colaborador é obrigatório')

    const docRef = doc(db, 'Colaboradores', id)
    const snap = await getDoc(docRef)

    const deptId = snap.exists()
      ? String((snap.data() as DocumentData)?.departamentoId ?? '')
      : ''

    const batch = writeBatch(db)

    if (deptId) {
      batch.update(doc(db, 'Departamentos', deptId), {
        colaboradorIds: arrayRemove(id),
        atualizadoEm: serverTimestamp(),
      })
    }

    batch.delete(docRef)

    await batch.commit()
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error)
    throw error
  }
}

export const excluirColaboradoresEmMassa = async (
  ids: string[]
): Promise<void> => {
  if (!ids.length) return

  const snaps = await Promise.all(
    ids.map((id) =>
      getDoc(doc(db, 'Colaboradores', id))
    )
  )

  const deptMap = new Map<string, string[]>()

  snaps.forEach((s, index) => {
    const id = ids[index]
    if (!s.exists()) return

    const deptId = String(
      (s.data() as DocumentData)?.departamentoId ?? ''
    )

    if (!deptId) return

    deptMap.set(deptId, [
      ...(deptMap.get(deptId) ?? []),
      id,
    ])
  })

  const batch = writeBatch(db)

  for (const [deptId, colIds] of deptMap.entries()) {
    batch.update(doc(db, 'Departamentos', deptId), {
      colaboradorIds: arrayRemove(...colIds),
      atualizadoEm: serverTimestamp(),
    })
  }

  ids.forEach((id) => {
    batch.delete(doc(db, 'Colaboradores', id))
  })

  await batch.commit()
}