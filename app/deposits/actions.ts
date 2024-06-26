'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {createDeposit,  updateDeposit } from '../data/dbQueries';

export async function addDeposit(user:String, prevState: any, formData: FormData) {
  
  const depositor_name = formData.get('depositor_name') 
  const deposit_amount = Number( formData.get('deposit_amount')) || 0
  const deposit_date = formData.get('deposit_date')
  const cash_location = formData.get('cash_location')

  if (!depositor_name) return {error: "Please select depositor"}
  
  try{
    await createDeposit({
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      recorded_by: user,
      cashLocation: cash_location
    })
  } catch(err : any){
    console.log(err)
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
  const cashLocation = formData.get('cash_location')

  if (!depositor_name) return {error: "Please select depositor"}
  
  try{
    await updateDeposit( deposit._id, {
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      cashLocation
    })
  } catch(err : any){
    return {error: err.message}
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/deposits');
  redirect('/deposits');
}