'use client'

import {
  executeMutation,
  executeQuery,
  mutationRef,
  queryRef,
} from 'firebase/data-connect'
import { getFirebaseDataConnect } from './firebase'

export type Guess = {
  userId: string
  eventId: string
  userName: string
  userEmail: string
  userPhotoURL: string | null
  totalGuess: number
  perTalkGuesses: Record<string, number>
  createdAt?: string
  updatedAt?: string
}

type GetMyGuessData = {
  guess: {
    userId: string
    eventId: string
    userName: string
    userEmail: string
    userPhotoURL: string | null
    totalGuess: number
    perTalkGuesses: Record<string, number> | null
    createdAt: string
    updatedAt: string
  } | null
}

type GetMyGuessVars = { eventId: string }

type UpsertVars = {
  eventId: string
  userName: string
  userEmail: string
  userPhotoURL: string | null
  totalGuess: number
  perTalkGuesses: Record<string, number>
}

export async function getMyGuess(eventId: string): Promise<Guess | null> {
  const dc = getFirebaseDataConnect()
  const ref = queryRef<GetMyGuessData, GetMyGuessVars>(dc, 'GetMyGuess', { eventId })
  const { data } = await executeQuery(ref)
  if (!data?.guess) return null
  return {
    ...data.guess,
    perTalkGuesses: data.guess.perTalkGuesses ?? {},
  }
}

export async function insertMyGuess(vars: UpsertVars): Promise<void> {
  const dc = getFirebaseDataConnect()
  const ref = mutationRef<unknown, UpsertVars>(dc, 'InsertMyGuess', vars)
  await executeMutation(ref)
}

export async function deleteMyGuess(eventId: string): Promise<void> {
  const dc = getFirebaseDataConnect()
  const ref = mutationRef<unknown, { eventId: string }>(dc, 'DeleteMyGuess', { eventId })
  await executeMutation(ref)
}
