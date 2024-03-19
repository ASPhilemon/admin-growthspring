'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {createDeposit,  updateDeposit } from '../data/dbQueries';

export async function addDeposit(user:String, prevState: any, formData: FormData) {
  
  const depositor_name = formData.get('depositor_name') 
  const deposit_amount = Number( formData.get('deposit_amount')) || 0
  const deposit_date = formData.get('deposit_date')
  const standardChartered = Number(formData.get('standardChartered')) || 0
  const unitTrust = Number(formData.get('unitTrust')) || 0
  const adminAndrew = Number(formData.get('adminAndrew')) || 0
  const adminRogers = Number(formData.get('adminRogers')) || 0

  const totalLocationsAmount = standardChartered + unitTrust + adminAndrew + adminRogers

  if (!depositor_name) return {error: "Please select depositor"}
  if (totalLocationsAmount !== deposit_amount) return {error: "The total amount in the cash locations must be equal to the deposit amount"}
  
  try{
    await createDeposit({
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      recorded_by: user,
      cashLocations: {
        standardChartered,
        unitTrust,
        adminAndrew,
        adminRogers
      }

    })
  } catch(err : any){
    return {error: err.message}
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/deposits');
  redirect('/deposits');
}

export async function editDeposit(deposit: any, prevState: any, formData: FormData) {
  
  const depositor_name = formData.get('depositor_name') 
  const deposit_amount = Number( formData.get('deposit_amount')) || 0
  const deposit_date = formData.get('deposit_date')
  const standardChartered = Number(formData.get('standardChartered')) || 0
  const unitTrust = Number(formData.get('unitTrust')) || 0
  const adminAndrew = Number(formData.get('adminAndrew')) || 0
  const adminRogers = Number(formData.get('adminRogers')) || 0

  const totalLocationsAmount = standardChartered + unitTrust + adminAndrew + adminRogers

  if (!depositor_name) return {error: "Please select depositor"}
  if (totalLocationsAmount !== deposit_amount && deposit.cashLocations  ) return {error: "The total amount in the cash locations must be equal to the deposit amount"}
  
  try{
    await updateDeposit( deposit._id, {
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      cashLocations: {
        standardChartered,
        unitTrust,
        adminAndrew,
        adminRogers
      }

    })
  } catch(err : any){
    return {error: err.message}
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/deposits');
  redirect('/deposits');
}