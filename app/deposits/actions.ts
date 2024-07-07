'use server'


import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {createDeposit,  updateDeposit } from '../data/dbQueries';
import { depositEmailConfirmationHTML } from '../components/DepositConfirmation';
import { sendMail } from '../sendMail';

export async function addDeposit(user:String, prevState: any, formData: FormData) {
  
  const depositor_name = formData.get('depositor_name') 
  let deposit_amount:any = formData.get('deposit_amount') || ""
  const deposit_date = formData.get('deposit_date')
  const cash_location = formData.get('cash_location')
  const comment = formData.get('comment')

  deposit_amount = parseFloat(String(deposit_amount).replace(/,/g, ''))

  if (!depositor_name) return {error: "Please select depositor"}
  
  try {
    const DepositEmailDetail = await createDeposit({
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      recorded_by: user,
      cashLocation: cash_location,
      comment
    })
    const emailBody = await depositEmailConfirmationHTML(DepositEmailDetail)
    sendMail({
      recipient: DepositEmailDetail.email,
      sender: "treasury",
      subject: `Deposit Confirmation ${DepositEmailDetail.date}`,
      body: emailBody,
      replyAddress: "philemonariko@gmail.com"
    })
    //console.log(emailBody)


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
  let deposit_amount:any = formData.get('deposit_amount') || ""
  const deposit_date = formData.get('deposit_date')
  const cashLocation = formData.get('cash_location')
  const comment = formData.get('comment')

  deposit_amount = parseFloat(String(deposit_amount).replace(/,/g, ''))
  
  if (!depositor_name) return {error: "Please select depositor"}
  
  try{
    await updateDeposit( deposit._id, {
      depositor_name,
      deposit_amount,
      deposit_date,
      source: "Savings",
      cashLocation,
      comment
    })
  } catch(err : any){
    return {error: err.message}
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/deposits');
  redirect('/deposits');
}

