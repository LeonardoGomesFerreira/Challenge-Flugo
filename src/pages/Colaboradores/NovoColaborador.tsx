import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Step,
  StepLabel,
  Stepper,
  LinearProgress,
  Button,
  Switch,
  Stack,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material'
import type { StepIconProps } from '@mui/material/StepIcon'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { useNavigate } from 'react-router-dom'

import { StepDadosPessoais } from '../../components/NovoColaboradorModal/StepDadosPessoais'
import { StepDadosProfissionais } from '../../components/NovoColaboradorModal/StepDadosProfissionais'
import { StepRevisao } from '../../components/NovoColaboradorModal/StepRevisao'
import type { Colaborador } from '../../types/Colaborador'
import { criarColaborador, listarColaboradores } from '../../services/colaboradores.service'
import { listarDepartamentos } from '../../services/departamentos.service'
import type { Departamento } from '../../types/Departamento'

const steps = ['Infos Básicas', 'Infos Profissionais', 'Revisão']

const initialState: Colaborador = {
  nome: '',
  email: '',
  ativo: true,
  departamentoId: '',
  departamentoNome: '',
  profissional: {
    cargo: '',
    dataAdmissao: '',
    nivelHierarquico: 'junior',
    gestorId: '',
    salarioBase: 0,
  },
}

function StepIcon(props: StepIconProps) {
  const { completed, active } = props
  if (completed) return <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 28 }} />
  if (active)
    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2px solid #22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#22C55E',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.875rem',
        }}
      >
        {String(props.icon ?? '')}
      </Box>
    )
  return <RadioButtonUncheckedIcon sx={{ color: '#D1D5DB', fontSize: 28 }} />
}

export default function NovoColaborador() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Colaborador>(initialState)
  const [saving, setSaving] = useState(false)

  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [gestores, setGestores] = useState<{ id: string; nome: string }[]>([])
  const [loadingDeps, setLoadingDeps] = useState(true)

  const [snack, setSnack] = useState<{ open: boolean; type: 'success' | 'error'; msg: string }>({
    open: false,
    type: 'success',
    msg: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      setLoadingDeps(true)
      try {
        const [deps, cols] = await Promise.all([listarDepartamentos(), listarColaboradores()])
        setDepartamentos(deps)
        setGestores(
          cols
            .filter((c) => c.profissional?.nivelHierarquico === 'gestor' && c.id)
            .map((c) => ({ id: c.id!, nome: c.nome }))
        )
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingDeps(false)
      }
    })()
  }, [])

  function handleChange(values: Partial<Colaborador>) {
    setData((prev) => ({ ...prev, ...values }))
  }

  const progress = useMemo(() => (step / (steps.length - 1)) * 100, [step])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}

    const nome = data.nome.trim()
    const email = data.email.trim()
    if (!nome) e.nome = 'Nome é obrigatório'
    if (!email) e.email = 'E-mail é obrigatório'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'E-mail inválido'

    if (!data.departamentoId) e.departamentoId = 'Departamento é obrigatório'

    if (!data.profissional.cargo.trim()) e.cargo = 'Cargo é obrigatório'
    if (!data.profissional.dataAdmissao) e.dataAdmissao = 'Data de admissão é obrigatória'
    if (!data.profissional.nivelHierarquico) e.nivelHierarquico = 'Nível é obrigatório'

    // Gestor: obrigatório para não-gestor
    if (data.profissional.nivelHierarquico !== 'gestor' && !data.profissional.gestorId) {
      e.gestorId = 'Gestor responsável é obrigatório'
    }

    if (!Number.isFinite(data.profissional.salarioBase) || data.profissional.salarioBase <= 0) {
      e.salarioBase = 'Informe um salário base válido'
    }

    return e
  }, [data])

  const canGoNext =
    (step === 0 && !errors.nome && !errors.email) ||
    (step === 1 &&
      !errors.departamentoId &&
      !errors.cargo &&
      !errors.dataAdmissao &&
      !errors.nivelHierarquico &&
      !errors.gestorId &&
      !errors.salarioBase) ||
    step === 2

  const gestorNome = useMemo(() => {
    const id = data.profissional.gestorId
    if (!id) return ''
    return gestores.find((g) => g.id === id)?.nome || ''
  }, [data.profissional.gestorId, gestores])

  async function handleConcluir() {
    try {
      setSaving(true)

      await criarColaborador({
        ...data,
        nome: data.nome.trim(),
        email: data.email.trim(),
      })

      setSnack({ open: true, type: 'success', msg: 'Colaborador cadastrado com sucesso!' })
      setTimeout(() => navigate('/colaboradores'), 600)
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setSnack({
        open: true,
        type: 'error',
        msg: 'Não foi possível salvar. Verifique o console.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box maxWidth={1100} mx="auto" sx={{ height: '100%' }}>
      <Typography color="text.secondary" mb={2} fontSize="1rem" fontWeight={600}>
        Colaboradores{' '}
        <Typography component="span" sx={{ color: '#D1D5DB', mx: 1, fontSize: '1rem' }}>
          •
        </Typography>
        <Typography component="span" sx={{ color: '#9CA3AF', fontSize: '1rem' }}>
          Cadastrar Colaborador
        </Typography>
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 99,
            bgcolor: 'rgba(34,197,94,0.15)',
            '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: '#22C55E' },
          }}
        />
        <Typography color="text.secondary" fontWeight={900} fontSize="1rem" minWidth={50} textAlign="right">
          {Math.round(progress)}%
        </Typography>
      </Stack>

      <Box display="flex" gap={6} sx={{ height: 'calc(100% - 120px)' }}>
        <Box minWidth={260}>
          <Stepper
            activeStep={step}
            orientation="vertical"
            sx={{
              '& .MuiStepConnector-line': {
                minHeight: 48,
                borderLeftWidth: 2,
                borderLeftStyle: 'solid',
                borderColor: '#E5E7EB',
                marginLeft: 1.7,
              },
              '& .Mui-active .MuiStepConnector-line': { borderColor: '#22C55E' },
              '& .Mui-completed .MuiStepConnector-line': { borderColor: '#22C55E' },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={(props) => <StepIcon {...props} active={step === index} icon={index + 1} />}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1rem',
                      fontWeight: step === index ? 800 : 600,
                      color: step === index ? '#111827' : '#9CA3AF',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            maxWidth: 720,
            p: 4,
            bgcolor: '#fff',
            borderRadius: 3,
            border: '1px solid #F3F4F6',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            {step === 0 && (
              <>
                <Typography variant="h5" mb={1} fontWeight={900} color="#111827">
                  Informações Básicas
                </Typography>
                <Typography color="#6B7280" mb={3} fontSize="0.95rem">
                  Preencha os dados pessoais do colaborador
                </Typography>

                <StepDadosPessoais data={data} onChange={handleChange} errors={{ nome: errors.nome, email: errors.email }} />

                <Stack direction="row" alignItems="center" mt={3} spacing={1.5}>
                  <Switch checked={data.ativo} onChange={(e) => handleChange({ ativo: e.target.checked })} />
                  <Typography fontWeight={600}>Ativar ao criar</Typography>
                </Stack>
              </>
            )}

            {step === 1 && (
              <>
                <Typography variant="h5" mb={1} fontWeight={900} color="#111827">
                  Informações Profissionais
                </Typography>
                <Typography color="#6B7280" mb={3} fontSize="0.95rem">
                  Defina departamento, cargo, nível e gestão.
                </Typography>

                <StepDadosProfissionais
                  data={data}
                  onChange={handleChange}
                  departamentos={departamentos}
                  gestores={gestores}
                  errors={{
                    departamentoId: errors.departamentoId,
                    cargo: errors.cargo,
                    dataAdmissao: errors.dataAdmissao,
                    nivelHierarquico: errors.nivelHierarquico,
                    gestorId: errors.gestorId,
                    salarioBase: errors.salarioBase,
                  }}
                />

                {loadingDeps && (
                  <Typography color="#9CA3AF" fontSize="0.875rem" mt={2}>
                    Carregando listas...
                  </Typography>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <Typography variant="h5" mb={1} fontWeight={900} color="#111827">
                  Revisão
                </Typography>
                <Typography color="#6B7280" mb={3} fontSize="0.95rem">
                  Confira os dados antes de finalizar
                </Typography>

                <StepRevisao data={data} gestorNome={gestorNome} />
              </>
            )}
          </Box>

          <Stack direction="row" justifyContent="space-between" mt={3} pt={3} sx={{ borderTop: '1px solid #F3F4F6' }}>
            <Button
              disabled={step === 0 || saving}
              onClick={() => setStep(step - 1)}
              sx={{
                color: '#6B7280',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(107, 114, 128, 0.08)' },
                '&:disabled': { color: '#D1D5DB' },
              }}
            >
              Voltar
            </Button>

            {step < 2 ? (
              <Button
                variant="contained"
                color="primary"
                disabled={!canGoNext || saving}
                onClick={() => setStep(step + 1)}
                sx={{ px: 5, py: 1.5, fontWeight: 800, borderRadius: 2 }}
              >
                Próximo
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled={saving}
                onClick={handleConcluir}
                sx={{ px: 5, py: 1.5, fontWeight: 800, borderRadius: 2 }}
              >
                {saving ? 'Salvando...' : 'Concluir'}
              </Button>
            )}
          </Stack>
        </Paper>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.type} variant="filled" sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
