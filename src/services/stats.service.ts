import { collection, getCountFromServer, query, where } from 'firebase/firestore'
import { db } from './firebase'

export async function getLoginStats(): Promise<{ ativos: number; departamentos: number }> {
  const colabsRef = collection(db, 'Colaboradores')
  const depsRef = collection(db, 'Departamentos')

  const ativosQ = query(colabsRef, where('ativo', '==', true))

  const [ativosSnap, depsSnap] = await Promise.all([
    getCountFromServer(ativosQ),
    getCountFromServer(depsRef),
  ])

  return {
    ativos: ativosSnap.data().count,
    departamentos: depsSnap.data().count,
  }
}