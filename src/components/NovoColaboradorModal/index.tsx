import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button, Stack } from '@mui/material'
import { StepDadosPessoais } from './StepDadosPessoais'
import { StepDadosProfissionais } from './StepDadosProfissionais'
import { StepRevisao } from './StepRevisao'
import type { Colaborador } from '../../types/Colaborador'

interface Props {
  open: boolean
  onClose: () => void
}

const initialState: Colaborador = {
  nome: '',
  email: '',
  departamento: '',
  ativo: true,
}

export function NovoColaboradorModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Colaborador>(initialState)

  function handleChange(values: Partial<Colaborador>) {
    setData((prev) => ({ ...prev, ...values }))
  }

  function next() {
    setStep((prev) => prev + 1)
  }

  function back() {
    setStep((prev) => prev - 1)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo Colaborador</DialogTitle>

      <DialogContent>
        {step === 0 && <StepDadosPessoais data={data} onChange={handleChange} />}
        {step === 1 && <StepDadosProfissionais data={data} onChange={handleChange} />}
        {step === 2 && <StepRevisao data={data} />}

        <Stack direction="row" justifyContent="space-between" mt={3}>
          {step > 0 && <Button onClick={back}>Voltar</Button>}
          {step < 2 && <Button onClick={next}>Próximo</Button>}
          {step === 2 && (
            <Button variant="contained" onClick={onClose}>
              Concluir
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}