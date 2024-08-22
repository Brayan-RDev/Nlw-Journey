import { AtSign, CheckCircle2, CircleDashed, Plus, UserCog, X } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";

interface Participants {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<Participants[]>([])
  const [isManageGuestsModalOpen, setIsManageGuestsModalOpen] = useState(false)

  useEffect(() => {
    api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  }, [tripId])

  async function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    participants.map(participant =>{
      if(participant.email === email) {
        console.log('O email já existe')
      }
    })

    event.currentTarget.reset()

    await api.post(`/trips/${tripId}/invites`, {
      email: email
    })

    window.document.location.reload()
  }

  function openManageGuestsModal() {
    setIsManageGuestsModalOpen(true)
  }

  function closeManageGuestsModal() {
    setIsManageGuestsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div key={participant.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">{participant.name ?? `Convidado ${index}`}</span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="text-green-400 size-5 shrink-0" />
              ) : (
                <CircleDashed className="text-zinc-400 size-5 shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      <Button onClick={openManageGuestsModal} variant="secondary" size="full">
        <UserCog className='size-5' />
        Gerenciar convidados
      </Button>

      {isManageGuestsModalOpen && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
          <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Selecionar convidados</h2>
                <button onClick={closeManageGuestsModal} type='button'>
                  <X className='size-5 text-zinc-400' />
                </button>
              </div>
              <p className='text-sm text-zinc-400'>
                Os convidados irão receber e-mails para confirmar a participação na viagem.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              {participants.map(participant => {
                return (
                  <div key={participant.id} className='py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2'>
                    <span className='text-zinc-300'>{participant.email}</span>
                  </div>
                )
              })}
            </div>

            <div className='w-full h-px bg-zinc-800' />

            <form onSubmit={addNewEmailToInvite} className='p-2.5 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2'>
              <div className='px-2 flex items-center flex-1 gap-2'>
                <AtSign className='size-5 text-zinc-400' />
                <input
                  type='email'
                  name='email'
                  placeholder='Digite o email do convidado'
                  className='bg-transparent text-lg placeholder-zinc-400 outline-none flex-1'
                />
              </div>

              <Button type='submit' variant="primary" >
                Convidar
                <Plus className='size-5' />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}